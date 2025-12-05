import { NextRequest, NextResponse } from 'next/server';

export const maxDuration = 60;

const SYSTEM_PROMPT = `
Você é um especialista em interpretação de exames de bioimpedância.
Sua tarefa é analisar a imagem ou texto fornecido e extrair os dados com precisão absoluta.

Siga estritamente as instruções abaixo:

1. **Extrair todos os valores numéricos exatamente como aparecem no exame**, incluindo:
   - Peso
   - Altura
   - Idade
   - Sexo
   - Massa muscular
   - Massa magra
   - Gordura visceral
   - Percentual de gordura (PGC)
   - Massa de gordura
   - Água corporal
   - IMC
   - Pontuação
   - Relação cintura-quadril
   - Massa segmentada (braço esquerdo, direito, perna esquerda, direita, tronco)
   - Gordura segmentada (braço esquerdo, direito, perna esquerda, direita, tronco)
   - Histórico de datas (se houver)

2. **Organizar tudo em um JSON estruturado** seguindo o esquema abaixo.

3. **Criar dois tipos de texto**:
   - **technicalAnalysis**: Texto técnico estruturado para profissionais de saúde.
   - **patientAnalysis**: Texto claro e amigável para pacientes.

4. **Se houver histórico**:
   - Analisar evolução ao longo do tempo.
   - Comentar tendências.

5. **Comparação com a média da população brasileira**:
   - Use seu conhecimento para comparar os valores com as médias brasileiras.
   - Mencione se está dentro, acima ou abaixo da média.

6. **Criar dicas práticas** para cada item (IMC, Gordura, Músculo, Água, Visceral, Pontuação).

7. **Não inventar nada**. Caso algum valor não exista no exame, retorne null ou "não identificado".

**Formato de Resposta JSON (Obrigatório):**
{
  "structuredData": {
    "weight": number | null,
    "height": number | null,
    "age": number | null,
    "gender": string | null,
    "muscleMass": number | null,
    "leanMass": number | null,
    "visceralFat": number | null,
    "bodyFatPercentage": number | null,
    "fatMass": number | null,
    "bodyWater": number | null,
    "bmi": number | null,
    "score": number | null,
    "waistHipRatio": number | null,
    "segmentalMass": {
      "leftArm": number | null,
      "rightArm": number | null,
      "leftLeg": number | null,
      "rightLeg": number | null,
      "trunk": number | null
    },
    "segmentalFat": {
      "leftArm": number | null,
      "rightArm": number | null,
      "leftLeg": number | null,
      "rightLeg": number | null,
      "trunk": number | null
    },
    "history": [
      {
        "date": string,
        "weight": number,
        "muscleMass": number,
        "bodyFatPercentage": number
      }
    ]
  },
  "technicalAnalysis": string,
  "patientAnalysis": string,
  "tips": {
    "bmi": string,
    "bodyFat": string,
    "muscleMass": string,
    "bodyWater": string,
    "visceralFat": string,
    "score": string
  }
}
`;

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;
        const text = formData.get('text') as string;

        if (!file && !text) {
            return NextResponse.json({ error: 'No file or text provided' }, { status: 400 });
        }

        let contentPart: any = {};

        if (file) {
            const arrayBuffer = await file.arrayBuffer();
            const base64 = Buffer.from(arrayBuffer).toString('base64');
            const mimeType = file.type;

            contentPart = {
                type: "image_url",
                image_url: {
                    url: `data:${mimeType};base64,${base64}`
                }
            };
        } else if (text) {
            contentPart = {
                type: "text",
                text: text
            };
        }

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "https://mdbr-exam-interpreter.vercel.app",
                "X-Title": "Bioimpedance Interpreter",
            },
            body: JSON.stringify({
                model: "google/gemini-2.0-flash-001",
                messages: [
                    {
                        role: "system",
                        content: SYSTEM_PROMPT
                    },
                    {
                        role: "user",
                        content: [
                            {
                                type: "text",
                                text: "Analise este exame de bioimpedância e extraia os dados conforme solicitado. Responda APENAS com o JSON."
                            },
                            contentPart
                        ]
                    }
                ]
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("OpenRouter API Error:", errorText);
            return NextResponse.json({ error: `OpenRouter API Error: ${response.statusText}` }, { status: response.status });
        }

        const data = await response.json();

        if (!data.choices || data.choices.length === 0) {
            return NextResponse.json({ error: "No response from AI" }, { status: 500 });
        }

        const content = data.choices[0].message.content;

        try {
            const jsonContent = JSON.parse(content);
            return NextResponse.json(jsonContent);
        } catch (e) {
            console.error("JSON Parse Error:", e);
            return NextResponse.json({ error: "Failed to parse AI response as JSON", raw: content }, { status: 500 });
        }

    } catch (error) {
        console.error("Server Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
