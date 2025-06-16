import express, { Request, Response } from "express";
import cors from "cors";
import Razorpay from "razorpay";

const port = 3000;
const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Added JSON middleware
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.json("Hello");
});

const razorpay = new Razorpay({
  key_id: "rzp_test_6W8yLHI2QeeY0Q", // Use environment variable
  key_secret: "qEoYEcmsC8MCXQfwSuC3TGh1", // Use environment variable
});

app.post("/create-order", async (req: Request, res: Response):Promise<void> => {
  try {
    console.log("Request body:", req.body);
    
    // Extract amount from nested data structure
    const { data } = req.body;
    const { amount } = data;
    
    // Validate amount
    if (!amount || isNaN(amount) || amount <= 0) {
       res.status(400).json({ error: "Invalid amount provided" });
    }
    else{
      const options = {
        amount: amount, // Amount should already be in paise from frontend
        currency: "INR",
        receipt: "receipt_" + Date.now(),
      };
  
      const order = await razorpay.orders.create(options);
      console.log("Order created:", order);
      res.json(order);
    }

   
    
  } catch (err) {
    console.error("Error creating order:", err);
    res.status(500).json({ error: "Failed to create order" });
  }
});

app.listen(port, () => {
  console.log("Server is Running on port", port);
});