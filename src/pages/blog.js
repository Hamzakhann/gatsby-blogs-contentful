import React from "react"
import { useStaticQuery, graphql, Link } from "gatsby"

import { GatsbyImage, getImage } from "gatsby-plugin-image"
import Layout from "../components/layout"
import SEO from "../components/seo"

const Blog = () => {
  const data = useStaticQuery(
    graphql`
      query {
        allContentfulBlogPost(sort: { fields: publishedData, order: DESC }) {
          edges {
            node {
              title
              id
              slug
              publishedData(formatString: "Do MMMM, YYYY")
              excerpt {
                childMarkdownRemark {
                  excerpt(pruneLength: 150)
                }
              }
              featuredImage {
                gatsbyImageData(layout: CONSTRAINED, placeholder: TRACED_SVG)
              }
            }
          }
        }
      }
    `
  )
  return (
    <Layout>
      <SEO title="Blog" />
      <p>
        <Link to="/">Go back to the homepage</Link>
      </p>
      <ul className="posts">
        {data.allContentfulBlogPost.edges.map(edge => {
          console.log(edge, "edge............")
          const pathToImage = getImage(edge.node.featuredImage)
          return (
            <li className="post" key={edge.node.id}>
              <h2>
                <Link to={`/blog/${edge.node.slug}/`}>{edge.node.title}</Link>
              </h2>
              <div className="meta">
                <span>Posted on {edge.node.publishedData}</span>
              </div>
              {edge.node.featuredImage && (
                <GatsbyImage
                  image={pathToImage}
                  className="recipe-img"
                  alt={edge.node.id}
                />
              )}
              <p className="excerpt">
                {edge.node.excerpt.childMarkdownRemark.excerpt}
              </p>
              <div className="button">
                <Link to={`/blog/${edge.node.slug}/`}>Read More</Link>
              </div>
            </li>
          )
        })}
      </ul>
    </Layout>
  )
}

export default Blog
