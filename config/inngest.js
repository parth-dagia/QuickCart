import { Inngest } from "inngest";
import connectDB from "./db";
import User from "@/models/User";

// Create a client
export const inngest = new Inngest({ id: "quickcart-next" });

// Sync user creation
export const syncUserCreation = inngest.createFunction(
  {
    id: "syncuserfromclerk",
    event: "clerk/user.created"
  },
  async ({ event }) => {
    const { id, first_name, last_name, image_url, email_addresses } = event.data;
    const userData = {
      _id: id,
      email: email_addresses[0].email_address,
      name: `${first_name} ${last_name}`,
      imageUrl: image_url
    };
    await connectDB();
    await User.create(userData);
  }
);

// Sync user update
export const syncUserUpdate = inngest.createFunction(
  {
    id: "updateuserfromclerk",
    event: "clerk/user.updated"
  },
  async ({ event }) => {
    const { id, first_name, last_name, image_url, email_addresses } = event.data;
    const userData = {
      _id: id,
      email: email_addresses[0].email_address,
      name: `${first_name} ${last_name}`,
      imageUrl: image_url
    };
    await connectDB();
    await User.findByIdAndUpdate(id, userData);
  }
);

// Sync user deletion
export const syncUserDeletion = inngest.createFunction(
  {
    id: "deleteuserfromclerk",
    event: "clerk/user.deleted"
  },
  async ({ event }) => {
    const { id } = event.data;
    await connectDB();
    await User.findByIdAndDelete(id);
  }
);
