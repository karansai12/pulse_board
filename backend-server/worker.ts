const GRAPHQL_ENDPOINT = "http://localhost:4000/"

const CREATE_VISIT_MUTATION = `#graphql 

    mutation CreateVisit($path:String!, $category: String!) {
    createVisit(path:$path, category:$category) {
    id 
    path
    category
    createdAt
    
    }
    }
`

const mockPath = ["/page_view", "/dashboard", "/docs", "checkout"]
const mockCategories = ["page_view", "dashboard", "docs", "checkout"]

function getRandomItem<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)]
}

async function recordVisit() {
    const variables = {
        path: getRandomItem(mockPath),
        category: getRandomItem(mockCategories)
    }


    try {
        const response = await fetch(GRAPHQL_ENDPOINT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                query: CREATE_VISIT_MUTATION,
                variables,
            }),
        });
        const result = await response.json();

        if (result.errors) {
            console.error("GraphQL Error:", result.errors);
        } else {
            console.log("Visit recorded:", result.data.createVisit);
        }
    } catch (error) {
        console.error("Failed to reach Apollo Server:", error);
    }
}

function scheduleNextRun() {
    const randomInterval = Math.floor(Math.random()*(10000-5000+1)) + 5000
    setTimeout(async()=>{
        await recordVisit()
        scheduleNextRun()

    },randomInterval)
}

console.log("🚀 Standalone worker started! Sending automated visits every 5-10s...");
scheduleNextRun();