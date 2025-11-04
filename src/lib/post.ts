import { prisma } from "@/lib/prisma";

export async function getPosts() {
    return await prisma.post.findMany({
        where: { published: true },
        include: {
            author: {
                select: {
                    name: true
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    })
}

export async function getPost(id: string) {
    return await prisma.post.findUnique({
        where: { id },
        include: {
            author: {
                select: {
                    name: true
                }
            }
        }
    })
}

export async function searchPosts(search: string) {
    const decodedSearch = decodeURIComponent(search)
    const normalizedSearch = decodedSearch.replace(/[\s ]+/g, ' ').trim()
    const searchWords = normalizedSearch.split(/\s+/).filter(Boolean)

//     const filters = [
//     // 単語ごとのAND検索
//     {
//       AND: searchWords.map(word => ({
//         OR: [
//           { title: { contains: word } },
//           { content: { contains: word } },
//         ],
//       })),
//     },
//     // フル文字列一致も対象にする
//     {
//       OR: [
//         { title: { contains: normalizedSearch } },
//         { content: { contains: normalizedSearch } },
//       ],
//     },
//   ]

//   return await prisma.post.findMany({
//     where: {
//       OR: filters, // どちらかの条件を満たせばOK
//     },
//     include: {
//       author: { select: { name: true } },
//     },
//     orderBy: { createdAt: 'desc' },
//   })
// }

    const filters = searchWords.map(word => ({
        OR : [
            { title: { contains: word }},
            { content: { contains: word }}
        ]
    }))

    return await prisma.post.findMany({
        where: {
            AND: filters
        },
        include: {
            author: {
                select: {
                    name: true
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    })
}