import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { api } from "~/utils/api";
import { PageLayout } from "~/components/layout";
import { generateServerSideHelper } from "~/server/helpers/serverSideHelper";
import { PostView } from "~/components/postView";

const SinglePostPage: NextPage<{ id: string }> = ({ id }) => {
  // Return user data
  const { data } = api.posts.getById.useQuery({
    id,
  });

  if (!data) return <div>404</div>;

  return (
    <>
      <Head>
        <title>`{data.post.content} - @{data.author.username}`</title>
      </Head>
      <PageLayout>
        <PostView {...data} />
      </PageLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const helper = generateServerSideHelper()

  // Gets slug from URL
  const id = context.params?.id;

  if (typeof id !== "string") throw new Error("No Slug");

  // prefetch for queries needed on client
  await helper.posts.getById.prefetch({id})

  return {
    // dehydrate cache
    props: { trpcState: helper.dehydrate(), id },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

export default SinglePostPage;
