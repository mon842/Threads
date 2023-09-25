import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs";
import { fetchThreadById } from "@/lib/actions/thread.actions";
import ThreadCard from "@/components/cards/ThreadCard";
import { fetchUser } from "@/lib/actions/user.actions";



async function page({ params }: { params: { id: string } }) {
    if (!params.id) return null;

    const user = await currentUser();
    if (!user) return null;

      const userInfo = await fetchUser(user.id);
      if (!userInfo?.onboarded) redirect("/onboarding");

    const thread = await fetchThreadById(params.id);
    console.log(thread);


    return (
        <section className='relative'>
            <div>
                <ThreadCard
                    id={thread._id}
                    currentUserId={user.id}
                    parentId={thread.parentId}
                    content={thread.text}
                    author={thread.author}
                    community={thread.community}
                    createdAt={thread.createdAt}
                    comments={thread.children}
                />
            </div>
        </section>

    )
}

export default page;