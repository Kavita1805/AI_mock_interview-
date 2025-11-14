"use client"
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { Input } from "@/components/ui/input" // Assuming Input is used by FormField
import FormField from "./FormField";
import { useRouter } from "next/navigation";
import { auth } from "@/firebase/client";
// import { sign } from "crypto"; // Unused import
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "firebase/auth"; // Correct imports
import { signUp, signIn } from "@/lib/actions/auth.action";

// Placeholder type for FormType
type FormType = "sign-in" | "sign-up";

const authFormSchema = (type: FormType) => {
  return z.object({
    name: type === "sign-up" ? z.string().min(3) : z.string().optional(),
    email: z.string().email(),
    password: z.string().min(3),
  })
}

const AuthForm = ({ type }: { type: FormType }) => {
  const router = useRouter();
  const formSchema = authFormSchema(type)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // FIX: Removed trailing space from "sign-up "
      if (type === "sign-up") {
        const { name, email, password } = values;
        // FIX: Use v9+ Firebase syntax
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const result = await signUp({ uid: userCredential.user.uid, name: name!, email, password });

        if (!result.success) {
          toast.error(result?.message);
          return;
        }
        toast.success("Account created successfully. Please sign in.");
        router.push("/sign-in");
      } else { // This is "sign-in"
        const { email, password } = values;
        // FIX: Use v9+ Firebase syntax
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        
        // FIX: Corrected variable name from idYToken to idToken
        const idToken = await userCredential.user.getIdToken();
        
        // FIX: Check the correct variable
        if (!idToken) {
          toast.error("Failed to retrieve ID token. Please try again.");
          return;
        }
        
        // FIX: Corrected typo from 'awiat' to 'await' and 'idToken'
        await signIn({ email, idToken });

        toast.success("Sign in successfully");
        router.push("/");
      }

    } catch (error: any) { // Added type 'any' to error
      console.log(error);
      // Provide a more specific error message if possible
      const errorMessage = error.message || "An unknown error occurred.";
      toast.error(`Something went wrong: ${errorMessage}`);
    }
  }

  const isSignIn = type === "sign-in"

  return (
    <div className="card-border lg:min-w-[566px]">
      <div className="flex flex-col gap-6 card py-14 px-10">
        <div className="flex flex-row gap-2 justify-center">
          <Image src="/logo.svg" alt="logo" height={32} width={38} />
          <h2 className="text-primary-100">PrepWise</h2>
        </div>
        <h3>Practice job interviews with AI</h3>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6 mt-4 form">
            
            {/* FIX: Logic reversed. Show "Name" for sign-up, not sign-in */}
            {!isSignIn && (
              <FormField
                control={form.control}
                name="name"
                label="Name"
                placeholder="Your Name"
                type="text"
              />
            )}

            <FormField
              control={form.control}
              name="email"
              label="Email"
              placeholder="Your email address"
              type="email"
            />

            <FormField
              control={form.control}
              name="password"
              label="Password"
              placeholder="Enter your password"
              type="password"
            />

            <Button className="btn" type="submit">{isSignIn ? "Sign In" : "Create an Account"}</Button>
          </form>
        </Form>
        <p className="text-center ">
          {isSignIn ? "New to PrepWise? " : "Already have an account? "}
          <Link href={!isSignIn ? "/sign-in" : "/sign-up"} className="font-bold text-primary ml-1">
            {/* This logic was correct, but 'type' is more direct */ }
            {type === "sign-in" ? "Sign up" : "Sign in"}
          </Link>
        </p>
      </div>
    </div>
  )
}

export default AuthForm
