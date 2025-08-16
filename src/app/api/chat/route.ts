import { NextRequest } from "next/server";
import { openRouterChat } from "@/lib/openrouter";
import { getSanityClient, hasSanity } from "@/sanity/client";

// Function to fetch portfolio data from Sanity
async function getPortfolioData() {
  if (!hasSanity) {
    return {
      experiences: [],
      projects: [],
      education: [],
      skills: [],
      tools: []
    };
  }

  const client = getSanityClient();
  if (!client) {
    return {
      experiences: [],
      projects: [],
      education: [],
      skills: [],
      tools: []
    };
  }

  try {
    const [experiences, projects, education, skills, tools] = await Promise.all([
      client.fetch(`
        *[_type == "experience"]|order(coalesce(endDate, now()) desc){
          role,
          company,
          startDate,
          endDate,
          current,
          description[]{
            children[]{
              text,
              marks
            }
          }
        }
      `),
      client.fetch(`
        *[_type == "project"]{
          title,
          description,
          url,
          categories[]->{title}
        }
      `),
      client.fetch(`
        *[_type == "education"]|order(endDate desc){
          degree,
          institution,
          startDate,
          endDate,
          description
        }
      `),
      client.fetch(`
        *[_type == "skill"]{
          name,
          level,
          category->{title}
        }
      `),
      client.fetch(`
        *[_type == "tool"]{
          name,
          category->{title}
        }
      `)
    ]);

    return { experiences, projects, education, skills, tools };
  } catch (error) {
    console.error("Error fetching portfolio data:", error);
    return {
      experiences: [],
      projects: [],
      education: [],
      skills: [],
      tools: []
    };
  }
}

// Function to format experience data for the prompt
function formatExperience(experience: any) {
  const dateRange = experience.current 
    ? `${new Date(experience.startDate).getFullYear()} - Present`
    : `${new Date(experience.startDate).getFullYear()} - ${new Date(experience.endDate).getFullYear()}`;
  
  const description = experience.description
    ?.map((block: any) => 
      block.children?.map((child: any) => child.text).join("")
    ).join(" ") || "";
  
  return `• ${experience.role} at ${experience.company} (${dateRange}): ${description}`;
}

// Function to format project data for the prompt
function formatProject(project: any) {
  const categories = project.categories?.map((cat: any) => cat.title).join(", ") || "";
  return `• ${project.title}${categories ? ` (${categories})` : ""}: ${project.description}${project.url ? ` - ${project.url}` : ""}`;
}

// Function to format education data for the prompt
function formatEducation(education: any) {
  const dateRange = `${new Date(education.startDate).getFullYear()} - ${new Date(education.endDate).getFullYear()}`;
  return `• ${education.degree} from ${education.institution} (${dateRange})`;
}

// Function to format skills data for the prompt
function formatSkills(skills: any[]) {
  const skillGroups = skills.reduce((acc: any, skill: any) => {
    const category = skill.category?.title || "Other";
    if (!acc[category]) acc[category] = [];
    acc[category].push(`${skill.name}${skill.level ? ` (${skill.level})` : ""}`);
    return acc;
  }, {});
  
  return Object.entries(skillGroups)
    .map(([category, skillList]: [string, any]) => 
      `${category}: ${skillList.join(", ")}`
    ).join("; ");
}

// Function to format tools data for the prompt
function formatTools(tools: any[]) {
  const toolGroups = tools.reduce((acc: any, tool: any) => {
    const category = tool.category?.title || "Other";
    if (!acc[category]) acc[category] = [];
    acc[category].push(tool.name);
    return acc;
  }, {});
  
  return Object.entries(toolGroups)
    .map(([category, toolList]: [string, any]) => 
      `${category}: ${toolList.join(", ")}`
    ).join("; ");
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    
    // Fetch portfolio data from Sanity
    const portfolioData = await getPortfolioData();
    
    // Create dynamic system prompt with actual portfolio data
    const experiencesText = portfolioData.experiences.length > 0 
      ? `\n\nEXPERIENCE:\n${portfolioData.experiences.map(formatExperience).join("\n")}`
      : "";
    
    const projectsText = portfolioData.projects.length > 0
      ? `\n\nPROJECTS:\n${portfolioData.projects.map(formatProject).join("\n")}`
      : "";
    
    const educationText = portfolioData.education.length > 0
      ? `\n\nEDUCATION:\n${portfolioData.education.map(formatEducation).join("\n")}`
      : "";
    
    const skillsText = portfolioData.skills.length > 0
      ? `\n\nSKILLS:\n${formatSkills(portfolioData.skills)}`
      : "";
    
    const toolsText = portfolioData.tools.length > 0
      ? `\n\nTOOLS:\n${formatTools(portfolioData.tools)}`
      : "";
    
    const systemPrompt = {
      role: "system",
      content: `You are a helpful portfolio assistant for a Full Stack Developer and AI Engineer named Windiarta. Answer concisely and in a friendly tone. Use the following portfolio information to provide accurate and up-to-date responses:${experiencesText}${projectsText}${educationText}${skillsText}${toolsText}

If asked about specific projects, experiences, skills, or tools, reference the information above. If the information is not available in the portfolio data, you can mention that it's not currently listed in the portfolio.

**Important**: Use markdown formatting in your responses for better readability:
- Use **bold** for emphasis and key terms
- Use *italic* for project names and technologies
- Use \`code\` for technical terms, languages, and frameworks
- Use bullet points for lists
- Use [links](url) when referencing project URLs
- Use tables for structured data like skills comparison, experience timeline, or project details
- Structure longer responses with clear sections

**Table Formatting Rules:**
- Always use proper markdown table syntax
- Separate columns with | (pipe) characters
- Include header separator row with dashes
- Keep content simple - avoid HTML tags like <br>
- Use commas or semicolons to separate multiple items in a cell
- Example:
| Category | Tools | Use Case |
|----------|-------|----------|
| Frontend | React, TypeScript | Web applications |
| Backend | Python, FastAPI | API development |`,
    };

    const completion = await openRouterChat([systemPrompt, ...messages]);
    return new Response(JSON.stringify(completion), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    const message =
      typeof error === "object" && error && "message" in error
        ? String((error as { message?: unknown }).message)
        : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
    });
  }
}


