import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { UserContext } from "./App";
import { castVote } from "./cast-vote";
import { CreatePost } from "./CreatePost";
import { GetPostsResponse } from "./database.types";
import { supaClient } from "./supa-client";
import { timeAgo } from "./time-ago";
import { UpVote } from "./UpVote";
import { usePostScore } from "./use-post-score";

export default function AllPosts() {
  const { session } = useContext(UserContext);
  const { pageNumber } = useParams();
  const [bumper, setBumper] = useState(0);
  const [posts, setPosts] = useState<GetPostsResponse[]>([]);
  const [myVotes, setMyVotes] = useState<
    Record<string, "up" | "down" | undefined>
  >({});
  const [totalPages, setTotalPages] = useState(0);
  useEffect(() => {
    const queryPageNumber = pageNumber ? +pageNumber : 1;
    Promise.all([
      supaClient
        .rpc("get_posts", { page_number: queryPageNumber })
        .select("*")
        .then(({ data }) => {
          setPosts(data as GetPostsResponse[]);
          if (session?.user) {
            supaClient
              .from("post_votes")
              .select("*")
              .eq("user_id", session.user.id)
              .then(({ data: votesData }) => {
                if (!votesData) {
                  return;
                }
                const votes = votesData.reduce((acc, vote) => {
                  acc[vote.post_id] = vote.vote_type;
                  return acc;
                }, {} as Record<string, "up" | "down" | undefined>);
                setMyVotes(votes);
              });
          }
        }),
      supaClient
        .from("posts")
        .select("*", { count: "exact", head: true })
        .filter("path", "eq", "root")
        .then(({ count }) => {
          count == null ? 0 : setTotalPages(Math.ceil(count / 10));
        }),
    ]);
  }, [session, bumper, pageNumber]);

  return (
    <>
      {session && (
        <CreatePost
          newPostCreated={() => {
            setBumper(bumper + 1);
          }}
        />
      )}

      <Pagination
        totalPages={totalPages}
        currentPage={pageNumber ? +pageNumber : 0}
      />

      <div className="posts-container">
        {posts?.map((post) => (
          <Post
            key={post.id}
            postData={post}
            myVote={myVotes?.[post.id] || undefined}
            onVoteSuccess={() => {
              setBumper(bumper + 1);
            }}
          />
        ))}
      </div>
    </>
  );
}

const selectedStyles = "border-2 border-white rounded p-2 bg-gray-700 text-green-400";
const notSelectedStyles = "rounded p-2 bg-gray-700";

function Pagination({
  totalPages,
  currentPage,
}: {
  currentPage: number;
  totalPages: number;
}) {
  const middleButtons = [currentPage];
  for (let i = currentPage - 1; i > 0 && i > currentPage - 5; i--) {
    middleButtons.unshift(i);
  }
  for (let i = currentPage + 1; i <= totalPages && i <= currentPage + 4; i++) {
    middleButtons.push(i);
  }
  return (
    <div className="flex justify-center gap-4 place-items-end">
      {currentPage > 5 ? (
        <Link
          data-e2e={`page-1`}
          className={notSelectedStyles}
          to={`/1`}
          key={1}
        >
          1
        </Link>
      ) : (
        <></>
      )}
      {currentPage > 6 ? <span data-e2e="starting-elipsis"> ... </span> : <></>}
      {middleButtons.map((pageNumber) => (
        <Link
          key={pageNumber}
          data-e2e={`page-${pageNumber}`}
          className={
            currentPage === pageNumber ? selectedStyles : notSelectedStyles
          }
          to={`/${pageNumber}`}
        >
          {pageNumber}
        </Link>
      ))}
      {totalPages - currentPage > 5 ? (
        <span data-e2e="ending-elipsis"> ... </span>
      ) : (
        <></>
      )}
      {totalPages - currentPage > 4 ? (
        <Link
          data-e2e={`page-${totalPages}`}
          className={notSelectedStyles}
          to={`/${totalPages}`}
          key={totalPages}
        >
          {totalPages}
        </Link>
      ) : (
        <></>
      )}
    </div>
  );
}

function Post({
  postData,
  myVote,
  onVoteSuccess,
}: {
  postData: GetPostsResponse;
  myVote: "up" | "down" | undefined;
  onVoteSuccess: () => void;
}) {
  const score = usePostScore(postData.id, postData.score);
  const { session } = useContext(UserContext);
  return (
    <div className="post-container">
      <div className="post-upvote-container">
        <UpVote
          direction="up"
          filled={myVote === "up"}
          enabled={!!session}
          onClick={async () => {
            await castVote({
              postId: postData.id,
              userId: session?.user.id as string,
              voteType: "up",
              onSuccess: () => {
                onVoteSuccess();
              },
            });
          }}
        />
        <p className="text-center" data-e2e="upvote-count">
          {score}
        </p>
        <UpVote
          direction="down"
          filled={myVote === "down"}
          enabled={!!session}
          onClick={async () => {
            await castVote({
              postId: postData.id,
              userId: session?.user.id as string,
              voteType: "down",
              onSuccess: () => {
                onVoteSuccess();
              },
            });
          }}
        />
      </div>
      <Link to={`/post/${postData.id}`} className="flex-auto">
        <p className="mt-4">
          Posted By {postData.username} {timeAgo((postData as any).created_at)}{" "}
          ago
        </p>
        <h3 className="text-2xl">{postData.title}</h3>
      </Link>
    </div>
  );
}