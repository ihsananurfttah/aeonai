const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.post('/api/chat', async (req, res) => {
  const { messages, apiKey, mode } = req.body;

  if (!apiKey) {
    return res.status(400).json({ error: 'Tuan, mohon masukkan API Key terlebih dahulu.' });
  }

  const isPro = mode === 'pro';
  const model = isPro ? 'gpt-4-turbo' : 'gpt-3.5-turbo';
  const maxTokens = isPro ? 1024 : 256;
  const temperature = isPro ? 0.3 : 0.7;

  // Simulasi jeda untuk mode Pro (lebih lambat)
  if (isPro) {
    await new Promise(resolve => setTimeout(resolve, 1800));
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model,
        messages: messages,
        max_tokens: maxTokens,
        temperature: temperature,
        stream: false
      })
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMsg = data.error?.message || 'Terjadi kesalahan pada API OpenAI.';
      return res.status(response.status).json({ error: errorMsg });
    }

    const reply = data.choices[0].message.content;
    res.json({ reply });

  } catch (err) {
    res.status(500).json({ error: 'Tuan, terjadi kegagalan koneksi ke server AI. Periksa jaringan Anda.' });
  }
});

app.listen(PORT, () => {
  console.log(`ÆON AI Server berjalan di http://localhost:${PORT}`);
});
