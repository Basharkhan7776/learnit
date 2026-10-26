// Serverless Function handler for Vercel / serverless deployments
// Handles POST /api/compile without client-side CORS limitations

export const config = {
  runtime: 'nodejs',
};

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { code, isTest } = req.body || {};
  if (!code || typeof code !== 'string') {
    return res.status(400).json({ error: 'Missing code in request body' });
  }

  try {
    const params = new URLSearchParams();
    params.append('version', '2');
    params.append('body', code);

    const response = await fetch('https://go.dev/_/compile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Golanger-Serverless-Runner/1.0',
      },
      body: params.toString(),
    });

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        stdout: '',
        stderr: `Go Playground returned HTTP ${response.status}: ${response.statusText}`,
        exitDetail: 'Upstream Error',
      });
    }

    const data: any = await response.json();
    let stdout = '';
    if (Array.isArray(data.Events)) {
      stdout = data.Events.map((e: any) => e.Message || '').join('');
    }

    const stderr = data.Errors || data.VetErrors || '';
    let passed = !stderr;

    if (isTest) {
      const combined = `${stdout} ${stderr}`;
      const hasFail = combined.includes('--- FAIL:') || combined.includes('FAIL\t') || combined.includes('\nFAIL');
      const hasPass = combined.includes('PASS\n') || combined.includes('--- PASS:');
      passed = !stderr && !hasFail && hasPass;
    }

    return res.status(200).json({
      success: passed,
      stdout,
      stderr,
      exitDetail: data.Errors ? 'Compilation failed' : (passed ? 'Exited with status 0' : 'Test failed'),
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      stdout: '',
      stderr: `Serverless execution error: ${err?.message || 'Failed to reach Go compiler'}`,
      exitDetail: 'Serverless Error',
    });
  }
}
