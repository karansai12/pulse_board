"use client";

import { client } from "@/lib/apolloClient";
import { store } from "@/lib/store/store";
import { ApolloProvider } from "@apollo/client/react";
import { Provider } from "react-redux";

export default function ApolloWrapper({children}:{children:React.ReactNode}) {
    return (
        <Provider store={store}> 
            <ApolloProvider client={client}>
        {children}
    </ApolloProvider>
        </Provider>
    
    )
}