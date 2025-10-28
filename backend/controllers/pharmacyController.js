const fs = require("fs");

// Helper: Convert file buffer to base64
function bufferToBase64(buffer) {
  return buffer.toString("base64");
}

// Helper: Safely parse JSON with fallback
function safeJSONParse(text, fallback = null) {
  try {
    return JSON.parse(text);
  } catch (error) {
    console.error("JSON Parse Error:", error.message);
    return fallback;
  }
}

exports.analyzePrescription = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    console.log("Received file:", {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
    });

    // Validate file type
    const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
    const mimeType = req.file.mimetype;

    if (!allowedTypes.includes(mimeType)) {
      return res.status(400).json({
        message: `Invalid file type. Allowed types: PDF, JPEG, PNG. Received: ${mimeType}`,
      });
    }

    const base64Data = bufferToBase64(req.file.buffer);
    const apiKey = process.env.GEMINI_API_KEY;
    const model = "gemini-2.5-flash-preview-09-2025";
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    // Structured extraction
    const prescriptionSchema = {
      type: "OBJECT",
      properties: {
        patientInfo: {
          type: "OBJECT",
          properties: {
            name: { type: "STRING" },
            address: { type: "STRING" },
            date: { type: "STRING" },
            refills: { type: "STRING" },
          },
          required: ["name", "address", "date", "refills"],
        },
        doctorInfo: {
          type: "OBJECT",
          properties: {
            name: { type: "STRING" },
            address: { type: "STRING" },
            phone: { type: "STRING" },
          },
          required: ["name", "address", "phone"],
        },
        medications: {
          type: "ARRAY",
          description:
            "A list of all prescribed medications and their strength.",
          items: {
            type: "OBJECT",
            properties: {
              nameAndStrength: { type: "STRING" },
              directions: { type: "STRING" },
            },
          },
        },
      },
      required: ["patientInfo", "doctorInfo", "medications"],
    };

    // 1. Structured data
    const systemPrompt =
      "You are an expert OCR and medical data extraction system. Your task is to precisely read the provided document image/PDF and extract the required information into the specified JSON format. DO NOT include any explanatory text or markdown outside the JSON object. If a field is not found, use 'N/A'. For prescriptions and directions, list each item separately.";
    const userQuery =
      "Extract all required prescription details, including patient info, doctor info, and a list of all medications and their directions.";
    const payload = {
      contents: [
        {
          role: "user",
          parts: [
            { text: userQuery },
            { inlineData: { mimeType, data: base64Data } },
          ],
        },
      ],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: prescriptionSchema,
      },
      systemInstruction: { parts: [{ text: systemPrompt }] },
    };
    console.log("Sending request to Gemini API with payload:", {
      mimeType,
      dataLength: base64Data.length,
      apiUrl,
    });

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error("Gemini API Error:", {
        status: response.status,
        statusText: response.statusText,
      });
      const errorText = await response.text();
      console.error("Error response:", errorText);
      throw new Error(
        `Gemini API error: ${response.status} ${response.statusText}`
      );
    }

    const result = await response.json();
    console.log("Gemini API Response:", result);

    let structuredData = null;

    if (!result.candidates || result.candidates.length === 0) {
      console.error("No candidates in response:", result);
      throw new Error("No analysis results returned from Gemini API");
    }

    try {
      const jsonText = result.candidates[0].content.parts[0].text;
      console.log("Parsing JSON response:", jsonText);
      structuredData = safeJSONParse(jsonText);

      if (!structuredData) {
        throw new Error("Failed to parse structured data from response");
      }
    } catch (error) {
      console.error("Error parsing Gemini response:", error);
      throw new Error("Failed to process document analysis results");
    }

    // 2. Text summary
    console.log("Generating text summary...");
    const summaryQuery =
      "Based on the provided prescription document, generate a concise, easy-to-read, one-paragraph summary of the patient, the doctor, and the prescribed medications and usage directions. Format important information like names and medications in bold using ** markers. Focus on providing clear, patient-friendly information.";
    const summaryPayload = {
      contents: [
        {
          role: "user",
          parts: [
            { text: summaryQuery },
            { inlineData: { mimeType, data: base64Data } },
          ],
        },
      ],
    };
    const summaryResponse = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(summaryPayload),
    });
    const summaryResult = await summaryResponse.json();
    let textSummary = "";
    if (summaryResult.candidates && summaryResult.candidates.length > 0) {
      textSummary = summaryResult.candidates[0].content.parts[0].text;
    }

    res.json({ structuredData, textSummary });
  } catch (error) {
    console.error("AI analysis failed:", error);
    res
      .status(500)
      .json({ message: "AI analysis failed", error: error.message });
  }
};
