import { useState } from "react";
import { Button } from "react-bootstrap";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { toast } from "react-toastify";
import axios from "axios";

interface DonationData {
  amount: number;
  [key: string]: unknown;
}

interface PaymentFormProps {
  donationData: DonationData;
  onSuccess: () => void;
  onBack: () => void;
}

const PaymentForm = ({ donationData, onSuccess, onBack }: PaymentFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: "if_required",
      });

      if (error) {
        toast.error(error.message);
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        // Save payment to database
        await axios.post("/api/payments/confirm", {
          ...donationData,
          stripePaymentId: paymentIntent.id,
        });

        toast.success("Payment successful! Thank you for your donation.");
        onSuccess();
      }
    } catch {
      toast.error("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />

      <div className="d-flex justify-content-between mt-4">
        <Button variant="outline-secondary" onClick={onBack} disabled={loading}>
          Back
        </Button>
        <Button type="submit" variant="primary" disabled={!stripe || loading}>
          {loading ? "Processing..." : `Donate $${donationData.amount}`}
        </Button>
      </div>
    </form>
  );
};

export default PaymentForm;
