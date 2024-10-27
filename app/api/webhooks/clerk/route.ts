import { clerkClient } from "@clerk/nextjs";
import { WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Webhook } from "svix";

import { createUser, deleteUser, updateUser } from "@/lib/actions/user.actions";

export async function POST(req: Request) {
  try {
    console.log("Webhook started");
    
    const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;
    if (!WEBHOOK_SECRET) {
      console.error("No webhook secret found");
      return new Response("No webhook secret found", { status: 500 });
    }

    // Verify headers
    const headerPayload = headers();
    const svix_id = headerPayload.get("svix-id");
    const svix_timestamp = headerPayload.get("svix-timestamp");
    const svix_signature = headerPayload.get("svix-signature");

    if (!svix_id || !svix_timestamp || !svix_signature) {
      return new Response("Error occurred -- no svix headers", { status: 400 });
    }

    // Get and verify payload
    const payload = await req.json();
    console.log("Full webhook payload:", JSON.stringify(payload, null, 2));
    
    const body = JSON.stringify(payload);
    const wh = new Webhook(WEBHOOK_SECRET);

    let evt: WebhookEvent;
    try {
      evt = wh.verify(body, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      }) as WebhookEvent;
    } catch (err) {
      console.error("Webhook verification failed:", err);
      return new Response("Error occurred", { status: 400 });
    }

    console.log("Event type:", evt.type);
    console.log("Event data:", JSON.stringify(evt.data, null, 2));

    if (evt.type === "user.created") {
      // Extract data carefully
      const userData = evt.data;
      console.log("Processing user data:", userData);

      const userId = userData.id;
      const username = userData.username;

      console.log("Extracted user info:", { userId, username });

      if (!userId) {
        console.error("Missing user ID");
        return new Response("Missing user ID", { status: 400 });
      }

      if (!username) {
        console.error("Missing username");
        return new Response("Missing username", { status: 400 });
      }

      try {
        const newUser = await createUser({
          username: username,
          clerk_id: userId,
        });

        console.log("User created in Supabase:", newUser);

        if (newUser?.id) {
          console.log("Updating Clerk metadata");
          await clerkClient.users.updateUserMetadata(userId, {
            publicMetadata: {
              userId: newUser.id,
            },
          });
          console.log("Clerk metadata updated successfully");
        }

        return NextResponse.json({ 
          success: true, 
          message: "User created successfully", 
          user: newUser 
        });
      } catch (error) {
        console.error("Failed to create user:", error);
        return new Response(
          JSON.stringify({ 
            error: "Failed to create user", 
          }), 
          { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }
    }

    // Return 200 for unhandled event types
    return new Response("Webhook processed", { status: 200 });

  } catch (error) {
    console.error("Webhook handler error:", error);
    return new Response(
      JSON.stringify({ 
        error: "Webhook processing failed", 
      }), 
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}