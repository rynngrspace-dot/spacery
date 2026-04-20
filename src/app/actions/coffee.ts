"use server";

import { supabase } from "@/lib/supabase";

export async function getCoffeeCount() {
  try {
    const { data, error } = await supabase
      .from('site_stats')
      .select('value')
      .eq('key', 'java_coffee_buzz')
      .single();

    if (error) throw error;
    return data?.value ?? 0;
  } catch (error) {
    console.error("Error fetching coffee count from Supabase:", error);
    return 0;
  }
}

export async function incrementCoffeeCount() {
  try {
    // Fetch current value
    const { data: current, error: fetchError } = await supabase
      .from('site_stats')
      .select('value')
      .eq('key', 'java_coffee_buzz')
      .single();

    if (fetchError) throw fetchError;

    const newValue = (current?.value || 0) + 1;

    // Update with new value
    const { data, error: updateError } = await supabase
      .from('site_stats')
      .update({ value: newValue })
      .eq('key', 'java_coffee_buzz')
      .select('value')
      .single();

    if (updateError) throw updateError;
    return data?.value ?? null;
  } catch (error) {
    console.error("Error incrementing coffee count in Supabase:", error);
    return null;
  }
}
