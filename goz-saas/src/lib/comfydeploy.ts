const API = 'https://api.comfydeploy.com';
const KEY = process.env.COMFYDEPLOY_API_KEY;
const DEPLOYMENT = process.env.COMFYDEPLOY_DEPLOYMENT_ID;

const POLL_INTERVAL_MS = 4_000;
const POLL_TIMEOUT_MS = 5 * 60_000;

export type RunStatus =
  | 'queued'
  | 'running'
  | 'started'
  | 'success'
  | 'failed'
  | 'cancelled'
  | 'timeout';

export type Run = {
  id: string;
  status: RunStatus;
  progress?: number;
  live_status?: string | null;
  outputs?: Array<{
    data?: { files?: Array<{ url?: string }> };
  }>;
};

function authHeaders(extra: Record<string, string> = {}) {
  if (!KEY) throw new Error('COMFYDEPLOY_API_KEY missing');
  return { Authorization: `Bearer ${KEY}`, ...extra };
}

export async function uploadAsset(
  bytes: Uint8Array,
  mime: string,
  filename = 'input.jpg'
): Promise<string> {
  const form = new FormData();
  form.append('file', new Blob([bytes as unknown as ArrayBuffer], { type: mime }), filename);
  const res = await fetch(`${API}/api/file/upload`, {
    method: 'POST',
    headers: authHeaders(),
    body: form,
  });
  if (!res.ok) {
    throw new Error(`comfydeploy upload ${res.status}: ${await res.text()}`);
  }
  const data = (await res.json()) as { download_url?: string; url?: string; file_url?: string };
  const url = data.download_url ?? data.url ?? data.file_url;
  if (!url) throw new Error(`comfydeploy upload: no url in response ${JSON.stringify(data)}`);
  return url;
}

export async function queueRun(inputs: { input_image: string; prompt: string }): Promise<string> {
  if (!DEPLOYMENT) throw new Error('COMFYDEPLOY_DEPLOYMENT_ID missing');
  const res = await fetch(`${API}/api/run/deployment/queue`, {
    method: 'POST',
    headers: authHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ deployment_id: DEPLOYMENT, inputs }),
  });
  if (!res.ok) {
    throw new Error(`comfydeploy queue ${res.status}: ${await res.text()}`);
  }
  const data = (await res.json()) as { run_id?: string; id?: string };
  const runId = data.run_id ?? data.id;
  if (!runId) throw new Error('comfydeploy queue: missing run id');
  return runId;
}

export async function getRun(runId: string): Promise<Run> {
  const res = await fetch(`${API}/api/run/${runId}`, { headers: authHeaders() });
  if (!res.ok) throw new Error(`comfydeploy status ${res.status}: ${await res.text()}`);
  return (await res.json()) as Run;
}

export async function generateVideo(
  prompt: string,
  inputImageUrl: string
): Promise<string> {
  const runId = await queueRun({ input_image: inputImageUrl, prompt });
  const t0 = Date.now();
  while (Date.now() - t0 < POLL_TIMEOUT_MS) {
    await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));
    const run = await getRun(runId);
    if (run.status === 'success') {
      const url = run.outputs?.[0]?.data?.files?.[0]?.url;
      if (!url) throw new Error('comfydeploy: run succeeded but no output url');
      return url;
    }
    if (run.status === 'failed' || run.status === 'cancelled' || run.status === 'timeout') {
      throw new Error(`comfydeploy: run ${run.status}`);
    }
  }
  throw new Error('comfydeploy: poll timeout (5min)');
}
