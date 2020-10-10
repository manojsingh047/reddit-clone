import { useRouter } from 'next/router';
import React, { useEffect } from 'react'
import { useMeQuery } from '../generated/graphql';

const useIsAuth = () => {
    const [{ data, fetching }] = useMeQuery();
    const router = useRouter();

    useEffect(() => {
        if (!fetching && !data?.me?.user) {
            router.replace(`/login?next=${router.pathname}`);
            console.log('not logged in');
        }
    }, [data, fetching, router]);
}

export default useIsAuth;
