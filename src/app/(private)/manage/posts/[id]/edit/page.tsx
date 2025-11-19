import EditPostForm from "./EditPostForm";
import { auth } from "@/auth";
import { notFound } from "next/navigation";
import { getOwnPost } from "@/lib/ownPost";

type Params = {
  params: { id: string };
};

export default async function EditPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
    const session = await auth();
    console.log(params)
      const userId = session?.user?.id;
      if (!session?.user?.email || !userId) {
        throw new Error("不正なリクエストです");
      }
      const {id} = await params
      const post = await getOwnPost(userId, id);
    
      if (!post) {
        return notFound();
      }
  return (
    <EditPostForm post={post} />
  )
}
