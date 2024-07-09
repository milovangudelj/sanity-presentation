import { Html } from "@react-email/components";

export function SubscribedNotification({ email }: { email: string }) {
  return (
    <Html>
      <h1>Thank you for subscribing!</h1>
      <p>
        You have successfully subscribed to our newsletter. You will now receive
        updates and news about our products and services.
      </p>
      <p>This notification has been sent to {email}.</p>
    </Html>
  );
}
