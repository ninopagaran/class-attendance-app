import { redirect } from "next/navigation";

import AuthForm from "@/components/AuthForm";
import { publicConfig } from "@/lib/public-config";

const Page = () => {
  if (!publicConfig.allowSignup) {
    redirect("/sign-in");
  }

  return <AuthForm type="sign-up" />;
};

export default Page;
