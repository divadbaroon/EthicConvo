import { Slide, TopOpinion, OpposingOpinion, UniqueOpinion, GraphDataItem } from "@/types"

export const topOpinionsData: TopOpinion[] = [
  {
    id: "topOpinion1",
    content: "Generative AI's use of copyrighted datasets without permission contributes to copyright infringement.",
    supportingArguments: [
      "Using copyrighted material without consent undermines the rights of original creators.",
      "It may discourage artists and content creators from sharing their work if they fear unauthorized usage.",
    ],
    Groups: [1, 5, 17, 21],
    slideId: "slide2"
  },
  {
    id: "topOpinion2",
    content: "The owner of the AI's work is a significant concern in AI and copyright issues..",
    supportingArguments: [
      "There is a lack of clarity on whether the creator of the AI, the AI itself, or the user should own the output.",
      "Existing copyright laws may not adequately cover the nuances of AI-generated content, leading to potential legal disputes.",
    ],
    Groups: [3, 7, 8, 12],
    slideId: "slide3"
  },
  {
    id: "topOpinion3",
    content: "Unclear ownership of AI-generated content is a problem.",
    supportingArguments: [
      "Ambiguous ownership can lead to disputes over profits and usage rights.",
      "It creates uncertainty for businesses and individuals seeking to monetize AI-generated content.",
    ],
    Groups: [2, 11, 14, 19],
    slideId: "slide3"
  },
];

export const opposingOpinions: OpposingOpinion[] = [
  {
    id: "opinion1",
    content:
      "AI-generated content should not be eligible for copyright protection.",
    rationale:
      "Because it lacks human authorship, which is a fundamental requirement for copyright.",
    Groups: [2, 11],
    slideId: "slide3"
  },
  {
    id: "opinion2",
    content: "Using copyrighted material for AI training is fair use.",
    rationale: "It promotes innovation and the advancement of technology.",
    Groups: [13, 19],
    slideId: "slide4"
  },
  {
    id: "opinion3",
    content: "AI models infringe on artists' rights.",
    rationale:
      "They replicate artistic styles without permission or compensation.",
    Groups: [12, 13],
    slideId: "slide1"
  },
  {
    id: "opinion4",
    content: "AI-generated works should be in the public domain.",
    rationale:
      "As they are created by machines, they should be freely accessible to all.",
    Groups: [11, 14],
    slideId: "slide3"
  },
  {
    id: "opinion5",
    content: "Strict regulations on AI will hinder progress.",
    rationale:
      "Over-regulation may stifle creativity and technological advancement.",
    Groups: [8, 12],
    slideId: "slide3"
  },
];

export const uniqueOpinionsData: UniqueOpinion[] = [
  {
    id: "uniqueOpinion1",
    content: "AI should pay royalties to the data it was trained on.",
    uniquenessScore: 85,
    rationale:
      "Compensates original creators and encourages data sharing.",
    Groups: [2],
  },
  {
    id: "uniqueOpinion2",
    content:
      "There should be a universal basic income funded by AI productivity.",
    uniquenessScore: 80,
    rationale: "Addresses job displacement due to automation.",
    Groups: [13],
  },
  {
    id: "uniqueOpinion3",
    content: "AI systems should be considered tools, not entities.",
    uniquenessScore: 78,
    rationale: "Emphasizes human responsibility and control.",
    Groups: [8],
  },
];

export const graphDataItems: GraphDataItem[] = [
  {
    id: "graph1",
    title: "Mentions per Topic in Group Discussion",
    data: [
      { name: "Generative AI Infringement", value: 22 },
      { name: "Intellectual Property Rights", value: 18 },
      { name: "Copyright Infringement", value: 14 },
      { name: "Use of Copyright", value: 13 },
      { name: "AI Training Material Use", value: 13 },
    ],
  },
  {
    id: "graph2",
    title: "Overall Scores of Topics",
    data: [
      { name: "Generative AI Infringement", value: 76.5 },
      { name: "Copyright Infringement", value: 70.9 },
      { name: "Intellectual Property Rights", value: 68.6 },
      { name: "Legal Strategies", value: 61.9 },
      { name: "Use of Copyright", value: 59.6 },
    ],
  },
  {
    id: "graph3",
    title: "Metrics for Top-Ranked Topic",
    data: [
      { name: "Frequency", value: 76.5 },
      { name: "Uniqueness", value: 63.0 },
      { name: "Supporting Evidence", value: 81.0 },
      { name: "Relevance", value: 85.5 },
    ],
  },
];

export const initialSlides: Slide[] = [
  {
    id: "slide1",
    title: "Introduction: Generative AI and Copyright",
    content: (
      <>
        <h3 className="text-2xl font-semibold mb-4">Overview</h3>
        <ul className="list-disc pl-8 mb-6 text-xl space-y-2">
          <li>Definition of Generative AI and its applications</li>
          <li>Brief history of copyright law and its purpose</li>
          <li>The intersection of AI and intellectual property rights</li>
          <li>
            Key stakeholders: AI developers, content creators, and users
          </li>
        </ul>
      </>
    ),
    insight:
      "Set the context for the discussion and introduce key themes.",
    background: "bg-gradient-to-r from-purple-600 to-blue-600",
    speakerNotes:
      "Welcome everyone. Today we'll explore the complex relationship between Generative AI and copyright law, setting the stage for our in-depth discussion.",
  },
  {
    id: "slide2",
    title: "Primary Causes of Copyright Infringement",
    content: (
      <>
        <h3 className="text-2xl font-semibold mb-4">Key Factors</h3>
        <ul className="list-disc pl-8 mb-6 text-xl space-y-2">
          <li>
            AI training on copyrighted material without explicit permission
          </li>
          <li>
            Difficulty in distinguishing AI-generated content from human-created
            works
          </li>
          <li>Lack of clear legal frameworks for AI-generated content</li>
          <li>Potential for mass production of derivative works</li>
          <li>
            Challenges in attributing authorship to AI-generated content
          </li>
        </ul>
      </>
    ),
    insight:
      "Identify the root causes of copyright concerns in AI context.",
    background: "bg-gradient-to-r from-red-500 to-orange-500",
    speakerNotes:
      "Discuss each point, encouraging students to think about the implications of these factors on creators and the creative process.",
  },
  {
    id: "slide3",
    title: "Technology Mechanisms and Copyright",
    content: (
      <>
        <h3 className="text-2xl font-semibold mb-4">
          AI and Copyrighted Content
        </h3>
        <ul className="list-disc pl-8 mb-6 text-xl space-y-2">
          <li>How AI models process and learn from existing works</li>
          <li>
            The concept of &apos;fair use&apos;in the context of AI training data
          </li>
          <li>
            Challenges in tracking the origin of AI-generated content
          </li>
          <li>
            Potential for unintentional reproduction of copyrighted elements
          </li>
        </ul>
      </>
    ),
    insight:
      "Explore the technical aspects of AI that intersect with copyright issues.",
    background: "bg-gradient-to-r from-green-500 to-teal-500",
    speakerNotes:
      "Explain the technical process of how AI uses data, and how this relates to copyright. Encourage discussion on the ethical implications.",
  },
  {
    id: "slide4",
    title: "Strategies and Legal Frameworks",
    content: (
      <>
        <h3 className="text-2xl font-semibold mb-4">
          Addressing Copyright Challenges
        </h3>
        <ul className="list-disc pl-8 mb-6 text-xl space-y-2">
          <li>Developing AI-specific copyright legislation</li>
          <li>Implementing licensing models for AI training data</li>
          <li>Creating a registry for AI-generated works</li>
          <li>
            Establishing guidelines for attribution in AI-assisted creations
          </li>
        </ul>
      </>
    ),
    insight:
      "Propose potential solutions to navigate the ethical and legal complexities.",
    background: "bg-gradient-to-r from-blue-500 to-indigo-500",
    speakerNotes:
      "Facilitate a discussion on these strategies, asking students to consider the pros and cons of each approach.",
  },
  {
    id: "slide5",
    title: "Group Discussion Insights",
    content: (
      <>
        <h3 className="text-2xl font-semibold mb-4">Key Takeaways</h3>
        <ul className="list-disc pl-8 mb-6 text-xl space-y-2">
          <li>Summary of main points raised during group discussions</li>
          <li>Unique perspectives shared by students</li>
          <li>Areas of consensus and disagreement</li>
        </ul>
      </>
    ),
    insight:
      "Synthesize the collective insights from the group discussions.",
    background: "bg-gradient-to-r from-pink-500 to-purple-500",
    speakerNotes:
      "Summarize the key points from the group discussions, highlighting particularly insightful or unique contributions.",
  },
  {
    id: "slide6",
    title: "Future Considerations and Questions",
    content: (
      <>
        <h3 className="text-2xl font-semibold mb-4">Looking Ahead</h3>
        <ul className="list-disc pl-8 mb-6 text-xl space-y-2">
          <li>Potential impact of AI on creative industries</li>
          <li>Evolving concepts of authorship and originality</li>
          <li>Balancing AI innovation with creator rights</li>
          <li>Ethical considerations in AI-generated content</li>
        </ul>
      </>
    ),
    insight:
      "Explore the future implications and open questions in AI and copyright.",
    background: "bg-gradient-to-r from-yellow-500 to-green-500",
    speakerNotes:
      "Encourage students to think about long-term implications and pose thought-provoking questions for further discussion or research.",
  },
  {
    id: "slide7",
    title: "Conclusion and Next Steps",
    content: (
      <>
        <h3 className="text-2xl font-semibold mb-4">Moving Forward</h3>
        <ul className="list-disc pl-8 mb-6 text-xl space-y-2">
          <li>Recap of key points from the discussion</li>
          <li>
            Importance of ongoing dialogue between technologists, creators, and
            lawmakers
          </li>
          <li>Potential areas for further research and study</li>
        </ul>
      </>
    ),
    insight:
      "Wrap up the discussion and motivate continued engagement with the topic.",
    background: "bg-gradient-to-r from-gray-700 to-gray-900",
    speakerNotes:
      "Summarize the session, emphasizing the complexity of the issue and the need for continued exploration and innovation in addressing these challenges.",
  },
];