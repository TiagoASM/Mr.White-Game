export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const OPENAI_KEY = process.env.OPENAI_API_KEY;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-5-mini",
      messages: [
        { role: "system", content: "Só JSON válido." },
        {
          role: "user",
          content: "Gera 2 palavras em PT, relacionadas mas não óbvias ex: '(civil:lua, undercover:sol', 'civil:piscina, undercover:praia'). JSON: {'civil':'...','undercover':'...'}"
        }
      ]
    })
  });

  const data = await response.json();
  res.status(200).json(data);
}
