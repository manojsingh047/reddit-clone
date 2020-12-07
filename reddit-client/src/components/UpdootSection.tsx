import { Flex, IconButton } from '@chakra-ui/core'
import React, { useState } from 'react'
import { PostSnippetFragment, useVoteMutation } from '../generated/graphql'

interface UpdootSectionProps {
    post: PostSnippetFragment;
}
const UpdootSection = ({ post }: UpdootSectionProps) => {
    const [, vote] = useVoteMutation();
    const [voteLoadingState, setVoteLoadingState] = useState<'updoot-loading' | 'downdoot-loading' | 'not-loading'>('not-loading');
    return (
        <Flex direction="column" justifyContent="center" alignItems="center" mr={4}>
            <IconButton
                onClick={async () => {
                    if (post.voteStatus === 1) {
                        return;
                    }
                    setVoteLoadingState('updoot-loading')
                    await vote({
                        postId: post.id,
                        value: 1
                    });
                    setVoteLoadingState('not-loading')
                }}
                variantColor={post.voteStatus === 1 ? 'green' : undefined}
                aria-label="updoot post"
                icon="chevron-up"
                isLoading={voteLoadingState === "updoot-loading"}
            />
            {post.points}
            <IconButton
                onClick={async () => {
                    if (post.voteStatus === -1) {
                        return;
                    }
                    setVoteLoadingState('downdoot-loading')
                    await vote({
                        postId: post.id,
                        value: -1
                    });
                    setVoteLoadingState('not-loading')
                }}
                aria-label="downdoot post"
                icon="chevron-down"
                variantColor={post.voteStatus === -1 ? 'red' : undefined}
                isLoading={voteLoadingState === "downdoot-loading"}
            />
        </Flex>
    )
}

export default UpdootSection
