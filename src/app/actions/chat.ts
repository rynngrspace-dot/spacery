"use server";

import { supabase } from "@/lib/supabase";

export async function getChatHistory() {
  try {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
       console.error("Error fetching chat history:", error);
       return [];
    }

    return data.map(msg => ({
      id: msg.id,
      text: msg.text,
      sender: msg.sender as "user" | "bot",
      location: msg.location,
      timestamp: new Date(msg.created_at)
    }));
  } catch (err) {
    console.error("Critical error fetching chat history:", err);
    return [];
  }
}
