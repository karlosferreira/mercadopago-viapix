import { NextApiRequest, NextApiResponse } from 'next';
import { MercadoPagoConfig, Payment } from 'mercadopago';

// Interface para tipar o objeto payer
interface Payer {
  email: string;
  first_name: string;
  last_name: string;
  identification: {
    type: string;
    number: string;
  };
}

async function createPixPayment(value: number, payer: Payer, accessToken: string) {
  // Step 2: Initialize the client object with the access token
  const client = new MercadoPagoConfig({ accessToken });

  // Step 3: Initialize the API object
  const payment = new Payment(client);

  // Step 4: Create the request object
  const body = {
    transaction_amount: value,
    description: 'Payment for your purchase',
    payment_method_id: 'pix',
    payer,
  };

  // Step 5: Create request options object - Optional
  const requestOptions = {
    idempotencyKey: 'unique-key-for-request',
  };

  try {
    // Step 6: Make the request
    const response = await payment.create({ body, requestOptions });

    // Ajuste para acessar a resposta corretamente
    const qrCodeBase64 = response;
    return qrCodeBase64;
  } catch (error) {
    console.error('Erro ao criar pagamento Pix:', error);
    throw new Error('Erro ao criar pagamento Pix');
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { accessToken, value, payer } = req.body;

    if (!accessToken || !value || !payer) {
      return res.status(400).json({ error: 'Dados insuficientes' });
    }

    console.log(req.body);

    try {
      const qrCodeBase64 = await createPixPayment(value, payer, accessToken);
      res.status(200).json({ success: true, qrCodeBase64 });
    } catch (error) {
      console.error('Erro ao processar o pagamento:', error);
      res.status(500).json({ error: 'Erro ao processar o pagamento' });
    }
  } else {
    res.status(405).json({ error: 'Método não permitido' });
  }
}
