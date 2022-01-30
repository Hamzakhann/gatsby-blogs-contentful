import React from "react"
import { graphql, Link } from "gatsby"
import { documentToReactComponents } from "@contentful/rich-text-react-renderer"
import { renderRichText } from "gatsby-source-contentful/rich-text"
import { INLINES, BLOCKS, MARKS } from "@contentful/rich-text-types"
import Layout from "../components/layout"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import SEO from "../components/seo"

export const query = graphql`
  query ($slug: String!) {
    contentfulBlogPost(slug: { eq: $slug }) {
      title
      publishedData(formatString: "Do MMMM, YYYY")
      featuredImage {
        gatsbyImageData(layout: CONSTRAINED, placeholder: TRACED_SVG)
      }
      body {
        raw
        references {
          contentful_id
          title
          file {
            url
          }
        }
      }
    }
  }
`

// const options = {
//   // renderMark: {
//   //   [MARKS.BOLD]: (text) => <b className="font-bold">{text}</b>,
//   // },
//   // renderNode: {
//   //   [INLINES.HYPERLINK]: (node, children) => {
//   //     const { uri } = node.data
//   //     return (
//   //       <a href={uri} className="underline">
//   //         {children}
//   //       </a>
//   //     )
//   //   },
//   //   [BLOCKS.HEADING_2]: (node, children) => {
//   //     return <h2>{children}</h2>
//   //   },
//   // },
// }

const BlogPost = props => {
  const pathToImage = getImage(props.data.contentfulBlogPost.featuredImage)
  const assets = new Map(
    props.data.contentfulBlogPost.body.references.map(ref => [ref.contentful_id, ref])
  )
  const options = {
    renderNode: {
      [BLOCKS.EMBEDDED_ASSET]: node => {
        const url = assets.get(node.data.target.sys.id).file.url
        const alt = assets.get(node.data.target.sys.id).title
        return <img alt={alt} src={url} />
      },
    },
  }
  return (
    <Layout>
      <SEO title={props.data.contentfulBlogPost.title} />
      <Link to="/blog/">Visit the Blog Page</Link>
      <div className="content">
        <h1>{props.data.contentfulBlogPost.title}</h1>
        <span className="meta">
          Posted on {props.data.contentfulBlogPost.publishedDate}
        </span>

        {props.data.contentfulBlogPost.featuredImage && (
          <GatsbyImage
            image={pathToImage}
            className="recipe-img"
            alt={"Hello"}
          />
        )}
        <div>
          {/* {renderRichText(props.data.contentfulBlogPost.body.raw, options)} */}
        </div>
        {documentToReactComponents(
          JSON.parse(props.data.contentfulBlogPost.body.raw),
          options
        )}
      </div>
    </Layout>
  )
}

export default BlogPost
