import { clerkClient } from "@clerk/nextjs";
import { WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Webhook } from "svix";

import { createUser, deleteUser, updateUser } from "@/lib/actions/user.actions";

export async function POST(req: Request) {
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the webhook
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", {
      status: 400,
    });
  }

  // Get the ID and type
  const { id } = evt.data;
  const eventType = evt.type;
  console.log("9. Event type:", eventType);

  try {
    // CREATE
    if (eventType === "user.created") {
      const { id, username } = evt.data;
      console.log("Received user data:", { id, username }); 

      if (!id) {
        console.log("Missing user ID"); 
        return new Response("Missing user ID", { status: 400 });
      }

      if (!username) {
        console.log("Missing username"); 
        return new Response("Missing username", { status: 400 });
      }

      try {
        console.log("Attempting to create user:", { id, username }); 
        const newUser = await createUser({
          username: username,
          clerk_id: id,
        });

        console.log("Create user result:", newUser);

        if (newUser?.id) {
          console.log("Updating Clerk metadata"); 
          await clerkClient.users.updateUserMetadata(id, {
            publicMetadata: {
              userId: newUser.id,
            },
          });
          console.log("Clerk metadata updated"); 
        }

        return NextResponse.json({ message: "OK", user: newUser });
      } catch (error) {
        console.error("Error creating user:", error); 
        throw error;
      }
    }

    // UPDATE
    if (eventType === "user.updated") {
      const { id, username } = evt.data;

      if (!id || !username) {
        return new Response("Missing required fields", { status: 400 });
      }

      const updatedUser = await updateUser(username, {
        username,
        last_active: new Date().toISOString(),
      });

      return NextResponse.json({ message: "OK", user: updatedUser });
    }

    // DELETE
    if (eventType === "user.deleted") {
      const { id } = evt.data;

      if (!id) {
        return new Response("Missing user ID", { status: 400 });
      }

      const deletedUser = await deleteUser(id);
      return NextResponse.json({ message: "OK", user: deletedUser });
    }

    return new Response("", { status: 200 });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return new Response("Error processing webhook", { status: 500 });
  }
}