import { verifyEmail } from "@/actions/verifyEmail";
import UpdateSession from "@/components/UpdateSession";
import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";
import Link from "next/link";

async function VerifyEmailPage({ searchParams }: any) {
  const { token = "" } = searchParams;
  const session = await getServerSession(authOptions);
  const { error, success } = await verifyEmail(token);

  if (!token) {
    return <div>Invalid token</div>;
  }

  if (error) {
    return (
      <div>
        <h1 className="text-lg text-red-400">{error}</h1>
      </div>
    );
  }

  if (success) {
    return (
      <div>
        <h1 className="text-lg text-green-300">Email verified successfully</h1>
        {!session && (
          <Link href="/login" className="bg-white text-black p-2">
            Login
          </Link>
        )}
        <UpdateSession />
      </div>
    );
  }
}

export default VerifyEmailPage;
