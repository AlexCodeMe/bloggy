import { getPost } from '@/actions/get-post'
import Reader from '@/components/custom/reader'
import Image from 'next/image'
import { formatDate } from '@/lib/utils'

export default async function BlogIdPage({ params }: { params: { blogId: string } }) {
  const { post } = await getPost(params.blogId)

  if (!post) {
    return <div className="px-4 py-8">Post not found</div>
  }

  return (
    <article className="w-full">
      {post.bannerImage && (
        <div className='relative w-full h-[50vh] mb-8'>
          <Image
            src={post.bannerImage}
            alt='Banner'
            layout="fill"
            objectFit="cover"
          />
        </div>
      )}
      <div className="max-w-3xl mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          <div className="flex items-center text-sm text-gray-500 mb-4">
            <span>{formatDate(post.createdAt)}</span>
            {post.updatedAt && post.updatedAt !== post.createdAt && (
              <>
                <span className="mx-2">•</span>
                <span>Updated: {formatDate(post.updatedAt)}</span>
              </>
            )}
          </div>
          {post.description && (
            <p className="text-xl text-black/80 dark:text-gray-300">{post.description}</p>
          )}
        </header>
        
        <div className="prose dark:prose-invert max-w-none">
          <Reader value={post.content} />
        </div>

        <footer className="mt-12">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200">
            Update
          </button>
        </footer>
      </div>
    </article>
  )
}