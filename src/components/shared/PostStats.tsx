import { useUserContext } from "@/context/AuthContext";
import { useDeleteSavedPost, useGetCurrentUser, useLikePost, useSavePost } from "@/lib/react-query/queriesAndMutations";
import { checkIsLiked } from "@/lib/utils";
import { Models } from "appwrite";
import { Loader } from "lucide-react";
import React, { useEffect, useState } from "react";

type PostStatsProps = {
    post?: Models.Document;
    userId: string;

}
const PostStats = ({ post, userId }: PostStatsProps) => {
    const likelist = post?.likes.map((user: Models.Document) => user.$id);
    const [likes, setLikes] = useState(likelist);
    const [isSaved, setIsSaved] = useState(false);
    const { mutate: likePost } = useLikePost();
    const { mutate: savePost, isPending: isSavingPost } = useSavePost();
    const { mutate: deleteSavePost, isPending: isDeletingSaved } = useDeleteSavedPost();
    const { data: currentuser } = useGetCurrentUser();
    const savedPostRecord = currentuser?.save.find((record: Models.Document) => record.$id === post?.$id);

    useEffect(() => {
        setIsSaved(!!savedPostRecord);
      }, [currentuser]);

    const handleLikePost = (e: React.MouseEvent) => {
        e.stopPropagation();
        let newLikes = [...likes];

        const hasLiked = newLikes.includes(userId)

        if (hasLiked) {
            newLikes = newLikes.filter((id) => id != userId);
        } else {
            newLikes.push(userId);
        }

        setLikes(newLikes);
        likePost({ postId: post?.$id || '', likesArray: newLikes })
    }
    const handleSavePost = (e: React.MouseEvent) => {
        e.stopPropagation();

        if (savedPostRecord) {
            setIsSaved(false);
            deleteSavePost(savedPostRecord.$id);
        } else {
            savePost({ postId: post?.$id || '', userId });
            setIsSaved(true);
        }

    }
    return (
        <div className="flex justify-between items-center z-20">
            <div className="flex gap-2 mr-5">
                <img src={checkIsLiked(likes, userId) ? "/assets/icons/liked.svg" : "/assets/icons/liked.svg"}
                    alt="liked" width={20} height={20}
                    onClick={handleLikePost}
                    className="cursor-pointer" />
                <p className="small-medium lg:base-medium">{likes.length}</p>
            </div>
            <div className="flex gap-2">
            {isSavingPost || isDeletingSaved ? <Loader/> :  <img src={isSaved ? "/assets/icons/save.svg" : "/assets/icons/save.svg"} alt="liked" width={20} height={20} onClick={handleSavePost} className="cursor-pointer" />}
            </div>
        </div>
    )
}

export default PostStats