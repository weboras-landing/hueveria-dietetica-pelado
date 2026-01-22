import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createAdminUser() {
    console.log("Creating admin user...");

    const email = "admin@elpelado.com";
    const password = "admin123456"; // CHANGE THIS IN PRODUCTION!

    // Create user via Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true, // Auto-confirm email
    });

    if (authError) {
        console.error("Error creating auth user:", authError);
        return;
    }

    console.log("✅ User created:", authData.user?.email);
    console.log("User ID:", authData.user?.id);

    // Create profile with admin role
    const { error: profileError } = await supabase.from("profiles").insert({
        id: authData.user!.id,
        role: "admin",
    });

    if (profileError) {
        console.error("Error creating profile:", profileError);
    } else {
        console.log("✅ Admin profile created");
    }

    console.log("\n========================================");
    console.log("Admin user created successfully!");
    console.log("Email:", email);
    console.log("Password:", password);
    console.log("========================================\n");
    console.log("You can now login at: http://localhost:3000/admin/login");
}

createAdminUser();
