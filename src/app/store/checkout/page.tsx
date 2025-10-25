'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useShoppingCart } from '@/lib/hooks/useShoppingCart';
import { SquarePaymentForm } from '../_components/SquarePaymentForm';
import { toast } from 'sonner';
import { logger } from '@/lib/logger';

export default function CheckoutPage() {
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const { items, getTotal, clearCart } = useShoppingCart();
  const [mounted, setMounted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isSignedIn) {
      router.push('/auth/login?redirect=/store/checkout');
    }
  }, [mounted, isSignedIn, router]);

  useEffect(() => {
    if (mounted && items.length === 0 && !orderComplete) {
      router.push('/store');
    }
  }, [mounted, items, orderComplete, router]);

  const total = getTotal();

  const handlePaymentSuccess = async (paymentToken: string) => {
    setIsProcessing(true);

    try {
      // Prepare cart items for the API
      const cartItems = items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      }));

      // Create payment
      const response = await fetch('/api/checkout/create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: cartItems,
          paymentMethod: 'SQUARE',
          paymentToken,
          shippingAddress: null, // TODO: Add shipping form
          shippingMethod: 'STANDARD',
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Payment failed');
      }

      const data = await response.json();

      // Clear cart and show success
      clearCart();
      setOrderId(data.orderId);
      setOrderComplete(true);

      toast.success('Payment successful!', {
        description: `Order #${data.orderId} has been placed.`,
      });
    } catch (error) {
      logger.error('Payment processing error', error);
      toast.error('Payment failed', {
        description: error instanceof Error ? error.message : 'Please try again.',
      });
      throw error; // Re-throw to show error in payment form
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentError = (error: string) => {
    logger.error('Payment error from form', { error });
    // Error is already shown in the form
  };

  if (!mounted) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (orderComplete) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="text-center py-12">
          <CardContent className="pt-6">
            <CheckCircle className="h-16 w-16 mx-auto text-green-500 mb-4" />
            <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
            <p className="text-muted-foreground mb-2">Your order has been confirmed.</p>
            {orderId && (
              <p className="text-sm text-muted-foreground mb-6">
                Order ID: <span className="font-mono">{orderId}</span>
              </p>
            )}
            <div className="flex gap-4 justify-center">
              <Button asChild size="lg" variant="outline">
                <Link href="/store">Continue Shopping</Link>
              </Button>
              <Button asChild size="lg">
                <Link href="/dashboard">View Orders</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/store/cart"
          className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Cart
        </Link>
        <h1 className="text-4xl font-bold">Checkout</h1>
        <p className="text-muted-foreground">Complete your purchase securely</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Order Summary */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Items */}
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.productId} className="flex gap-4">
                    <div className="flex-1">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-muted-foreground">Quantity: {item.quantity}</div>
                    </div>
                    <div className="font-medium">${(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Totals */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax</span>
                  <span>$0.00</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment Form */}
        <div>
          <SquarePaymentForm
            amount={total}
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
          />
        </div>
      </div>
    </div>
  );
}
