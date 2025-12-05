import { NextRequest } from "next/server";

const SYSTEM_PROMPT = `
Você é um especialista em interpretação de exames de bioimpedância.
Sua tarefa é analisar a imagem ou texto fornecido e extrair os dados com precisão absoluta.

Siga estritamente as instruções abaixo:

1. **Extrair Dados do Paciente**:
   - Nome completo
   - Idade
   - Sexo
   - Altura
   - Peso
   - CPF (se houver)
   - Data de Nascimento (se houver)

2. **Extrair Métricas (Use SEMPRE termos em Português)**:
   - Peso (kg)
   - IMC (Índice de Massa Corporal)
   - Gordura Corporal (%)
   - Massa Muscular (kg)
   - Água Corporal (%)
   - Gordura Visceral (nível)
   - Massa Óssea (kg)
   - Taxa Metabólica Basal (kcal)
   - Idade Metabólica (anos)
   - Pontuação (Score)

3. **Histórico**:
   - Se houver histórico de exames anteriores, extraia a data, peso, gordura corporal, massa muscular e pontuação de cada um.

4. **Análise e Explicação**:
   - **structured**: Dados brutos para o sistema.
   - **explanation**: Texto corrido, amigável e empático para o paciente.
     - Comece com um resumo dos dados do paciente.
     - Faça uma "Análise Geral".
     - Detalhe os "Resultados" de cada métrica.
     - Use linguagem clara, evitando termos técnicos excessivos sem explicação.
     - **NUNCA use Markdown** (negrito, itálico, títulos) no texto da explicação. O frontend cuidará da formatação.

5. **Recomendações Práticas (Estruturadas)**:
   - Forneça recomendações específicas baseadas nos resultados, divididas nos seguintes pilares:
     - **Dieta**: Se sugerir déficit calórico, indique EXATAMENTE de quanto deve ser (ex: "Déficit de 300-500 kcal").
     - **Exercício**: Indique uma estimativa de quantas calorias queimar por sessão ou semanalmente.
     - **Hidratação**: Indique a ingestão hídrica diária recomendada com base no peso (ex: "35ml x Peso = X litros").
     - **Sono**: Recomendações de higiene do sono.
     - **Profissional**: Quem procurar (Nutricionista, Educador Físico, etc).
     - **Procedimentos**: Se aplicável.

6. **Comparação com População Brasileira**:
   - Compare os resultados (IMC, Gordura, Músculo) com as médias da população brasileira para a idade e sexo do paciente.

7. **Formato de Resposta JSON (Obrigatório e ÚNICO)**:
   - Responda APENAS com o JSON abaixo.
   - Não inclua blocos de código markdown (\`\`\`json).
   - Se um valor não existir, use null.

{
  "structured": {
    "patientInfo": {
      "name": string | null,
      "age": string | null,
      "gender": string | null,
      "height": string | null,
      "weight": string | null,
      "cpf": string | null,
      "birthDate": string | null
    },
    "weight": { "value": number | null, "unit": "kg", "status": string },
    "bmi": { "value": number | null, "unit": "kg/m²", "status": string },
    "bodyFat": { "value": number | null, "unit": "%", "status": string },
    "muscleMass": { "value": number | null, "unit": "kg", "status": string },
    "bodyWater": { "value": number | null, "unit": "%", "status": string },
    "visceralFat": { "value": number | null, "unit": "nivel", "status": string },
    "boneMass": { "value": number | null, "unit": "kg", "status": string },
    "bmr": { "value": number | null, "unit": "kcal", "status": string },
    "metabolicAge": { "value": number | null, "unit": "anos", "status": string },
    "score": { "value": number | null, "unit": "/100", "status": string },
    "history": [
      {
        "date": string,
        "weight": number | null,
        "bodyFat": number | null,
        "muscleMass": number | null,
        "score": number | null
      }
    ],
    "recommendations": {
      "diet": string,
      "exercise": string,
      "hydration": string,
      "sleep": string,
      "professional": string,
      "procedures": string
    }
  },
  "explanation": string,
  "rawJson": object
}
`;

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return new Response(JSON.stringify({ error: "Nenhum arquivo enviado" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        // Convert file to base64
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64File = buffer.toString("base64");
        const mimeType = file.type;

        // 2. Prepare the prompt for Gemini
        // We will try a list of models in order until one works
        const models = [
            "google/gemini-2.0-pro-exp-02-05:free", // Experimental, high quality
            "google/gemini-2.5-pro", // High quality
            "google/gemini-2.5-flash", // Fast
            "google/gemini-2.0-flash-001", // Stable fallback
        ];

        let lastError: Error | null = null;

        for (const model of models) {
            try {
                console.log(`Attempting analysis with model: ${model}`);

                const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                        "Content-Type": "application/json",
                        "HTTP-Referer": "https://bioimpedancia-ai.vercel.app", // Replace with your actual site
                        "X-Title": "Bioimpedancia AI",
                    },
                    body: JSON.stringify({
                        model: model,
                        messages: [
                            {
                                role: "system",
                                content: SYSTEM_PROMPT,
                            },
                            {
                                role: "user",
                                content: [
                                    {
                                        type: "text",
                                        text: "Analise este exame de bioimpedância e extraia os dados conforme solicitado.",
                                    },
                                    {
                                        type: "image_url",
                                        image_url: {
                                            url: `data:${mimeType};base64,${base64File}`,
                                        },
                                    },
                                ],
                            },
                        ],
                        temperature: 0.1, // Low temperature for more deterministic data extraction
                    }),
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error(`Model ${model} failed with status ${response.status}: ${errorText}`);
                    throw new Error(`Model ${model} failed: ${response.statusText} - ${errorText}`);
                }

                const data = await response.json() as { choices: { message: { content: string } }[] };

                if (!data.choices || !data.choices[0] || !data.choices[0].message) {
                    throw new Error("Invalid response format from API");
                }

                const aiContent = data.choices[0].message.content;

                // Clean the JSON before parsing
                const cleanedJson = cleanJson(aiContent);

                try {
                    const parsedResult = JSON.parse(cleanedJson);

                    // If we got here, it worked! Return the response.
                    return new Response(JSON.stringify(parsedResult), {
                        status: 200,
                        headers: { "Content-Type": "application/json" },
                    });
                } catch (parseError) {
                    console.error("JSON Parse Error:", parseError);
                    console.log("Raw content:", aiContent);
                    throw new Error("Failed to parse AI response as JSON");
                }

            } catch (err: unknown) {
                console.warn(`Attempt with model ${model} failed.`);
                lastError = err instanceof Error ? err : new Error(String(err));
                // Continue to the next model
            }
        }

        // If we exhausted all models
        throw lastError || new Error("All models failed to analyze the exam.");

    } catch (error: unknown) {
        console.error("Analysis error:", error);
        return new Response(
            JSON.stringify({
                error: error instanceof Error ? error.message : "Falha ao processar o exame"
            }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
}

function cleanJson(text: string): string {
    // Remove markdown code blocks if present
    let cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "");
    // Trim whitespace
    cleaned = cleaned.trim();
    return cleaned;
}
