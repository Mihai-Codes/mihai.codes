// Blog posts data - simple TypeScript-based approach for now
// Can be migrated to MDX later for more complex content

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  content: string;
  readingTime: string;
  draft?: boolean; // If true, post is hidden from listing but accessible by direct URL
}

export const posts: BlogPost[] = [
  {
    slug: 'aws-bedrock-anthropic-troubleshooting',
    title: 'AWS Bedrock + Anthropic Claude: The Complete Troubleshooting Guide',
    description: 'Three undocumented gotchas that will save you hours of debugging when setting up Claude models on AWS Bedrock.',
    date: '2026-01-09',
    tags: ['aws', 'bedrock', 'anthropic', 'cloud'],
    readingTime: '8 min read',
    draft: true, // Set to false when ready to publish
    content: `
# AWS Bedrock + Anthropic Claude: The Complete Troubleshooting Guide (2026)

> Three undocumented gotchas that will save you hours of debugging

---

## TL;DR

Getting cryptic errors trying to use Anthropic Claude models on AWS Bedrock? Here are the three issues I encountered and their fixes:

| Problem | Error Message | Solution |
|---------|---------------|----------|
| Form validation | "Model use case details have not been submitted" | Use \`www.\` prefix in website URL |
| Wrong model ID | "on-demand throughput isn't supported" | Use \`us.anthropic.claude-*\` (with regional prefix) |
| Can't find settings | N/A | Go to Model Catalog, not Model Access |

---

## Introduction

I recently spent several hours debugging what seemed like a simple task: getting Claude models to work on AWS Bedrock. 

The error messages were cryptic. The documentation was scattered. And some crucial details weren't documented at all.

This guide documents everything I learned so you don't have to go through the same frustration.

**What you'll learn:**
- How to correctly submit the Anthropic use case form
- The difference between model IDs and inference profile IDs
- Where to find model settings after AWS retired the Model Access page
- Working commands to test all Claude models

---

## The Error That Started Everything

\`\`\`
undefined: Model use case details have not been submitted for this account. 
Fill out the Anthropic use case details form before using the model. 
If you have already filled out the form, try again in 15 minutes.
\`\`\`

Sounds straightforward, right? Just fill out a form.

But here's where it gets interesting...

---

## Problem #1: The Hidden Form Validation

### The Issue

AWS Bedrock requires first-time users of Anthropic models to submit a use case form. This form asks for basic information: company name, website, intended use case.

But there's a hidden validation rule that's **not documented anywhere**: 

> **Your website URL MUST include the "www." prefix.**

### What Happens

| Input | Result |
|-------|--------|
| \`example.com\` | Form silently fails, no clear error |
| \`www.example.com\` | Form succeeds |

### The Fix

When filling out the Anthropic use case form, always include \`www.\`:

\`\`\`diff
+ www.quantic.edu
+ www.yourcompany.com
- quantic.edu
- yourcompany.com
\`\`\`

### Where to Find This Form

The old "Model Access" page has been **retired**. You won't find a dedicated page for enabling models anymore.

Instead:
1. Go to **Amazon Bedrock Console**
2. Click **Model Catalog** (not Model Access!)
3. Search for any Claude model (e.g., "Claude Sonnet 4")
4. Click on it → You'll be prompted to submit use case details

---

## Problem #2: Inference Profile IDs vs Model IDs

### The Error

\`\`\`
ValidationException: Invocation of model ID anthropic.claude-opus-4-5-20251101-v1:0 
with on-demand throughput isn't supported. Retry your request with the ID or ARN 
of an inference profile that contains this model.
\`\`\`

### The Issue

AWS Bedrock has two types of model identifiers:

**Direct Model IDs** (don't work for newer Claude models):
\`\`\`
anthropic.claude-opus-4-5-20251101-v1:0
\`\`\`

**Inference Profile IDs** (required):
\`\`\`
us.anthropic.claude-opus-4-5-20251101-v1:0
\`\`\`

Notice the \`us.\` prefix? That's the key difference.

### Regional Prefixes Explained

| Prefix | Meaning | Use When |
|--------|---------|----------|
| \`us.\` | US inference profile | Your region is us-east-1, us-west-2, etc. |
| \`eu.\` | EU inference profile | Your region is eu-west-1, eu-central-1, etc. |
| \`global.\` | Global inference profile | Works across all regions |

### Working Model IDs (US Region)

\`\`\`bash
# Opus 4.5 (Best quality, highest cost)
us.anthropic.claude-opus-4-5-20251101-v1:0

# Sonnet 4.5 (Balanced)
us.anthropic.claude-sonnet-4-5-20250929-v1:0

# Sonnet 4 (Legacy)
us.anthropic.claude-sonnet-4-20250514-v1:0

# Haiku 4.5 (Fast, lowest cost)
us.anthropic.claude-haiku-4-5-20251001-v1:0
\`\`\`

### How to Find Available Inference Profiles

\`\`\`bash
aws bedrock list-inference-profiles --region us-east-1 \\
  --query 'inferenceProfileSummaries[?contains(inferenceProfileId, \\\`anthropic\\\`)].inferenceProfileId' \\
  --output table
\`\`\`

---

## Problem #3: The Model Access Page Was Retired

### What Changed

AWS recently simplified model access:
- Most models now **auto-enable** on first invocation
- No need to manually "enable" models anymore
- The dedicated "Model Access" page is deprecated

### The Exception: Anthropic

Anthropic models are the exception. They still require:
1. One-time use case form submission
2. Approval (usually instant)
3. AWS Marketplace subscription (auto-created after form submission)

### What You'll See

After submitting the form, check AWS Marketplace Subscriptions:

\`\`\`
Product: Claude Haiku 4.5 (Amazon Bedrock Edition)
Status: Active
\`\`\`

**Good news:** One subscription covers **all** Anthropic models - you don't need separate subscriptions for Opus, Sonnet, and Haiku.

---

## Complete Working Setup

### Step 1: Verify AWS Credentials

\`\`\`bash
aws configure list
# Should show access_key, secret_key, and region
\`\`\`

### Step 2: Set Region

\`\`\`bash
export AWS_REGION=us-east-1
\`\`\`

### Step 3: Test Model Access

\`\`\`bash
# Create test payload
cat > /tmp/test.json << 'EOF'
{
  "anthropic_version": "bedrock-2023-05-31",
  "max_tokens": 50,
  "messages": [{"role": "user", "content": "Hello, respond with just 'Hi!'"}]
}
EOF

# Test Opus 4.5
aws bedrock-runtime invoke-model \\
  --model-id us.anthropic.claude-opus-4-5-20251101-v1:0 \\
  --body fileb:///tmp/test.json \\
  --content-type application/json \\
  /tmp/response.json

# Check response
cat /tmp/response.json | python3 -m json.tool
\`\`\`

### Step 4: Verify All Models

\`\`\`bash
#!/bin/bash
# test-all-claude-models.sh

MODELS=(
  "us.anthropic.claude-opus-4-5-20251101-v1:0"
  "us.anthropic.claude-sonnet-4-5-20250929-v1:0"
  "us.anthropic.claude-sonnet-4-20250514-v1:0"
  "us.anthropic.claude-haiku-4-5-20251001-v1:0"
)

for model in "\${MODELS[@]}"; do
  echo -n "Testing $model... "
  if aws bedrock-runtime invoke-model \\
    --model-id "$model" \\
    --body fileb:///tmp/test.json \\
    --content-type application/json \\
    /tmp/response.json 2>/dev/null; then
    echo "SUCCESS"
  else
    echo "FAILED"
  fi
done
\`\`\`

---

## Troubleshooting Checklist

### Error: "Model use case details have not been submitted"

- [ ] Submit form with \`www.\` prefix in website URL
- [ ] Wait 5-15 minutes after submission
- [ ] Check AWS Marketplace Subscriptions for active subscription

### Error: "on-demand throughput isn't supported"

- [ ] Use inference profile ID (with \`us.\`, \`eu.\`, or \`global.\` prefix)
- [ ] Verify region matches prefix (\`us.\` for US regions)
- [ ] Run \`aws bedrock list-inference-profiles\` to get correct IDs

### Error: "Access denied" or model not found

- [ ] Verify AWS credentials: \`aws configure list\`
- [ ] Check IAM permissions include \`bedrock:InvokeModel\`
- [ ] Confirm region is set: \`echo $AWS_REGION\`

---

## Quick Reference Card

| Task | Command/Action |
|------|----------------|
| Submit use case form | Model Catalog → Select Claude model → Submit details |
| Check subscriptions | AWS Marketplace → Manage Subscriptions |
| List inference profiles | \`aws bedrock list-inference-profiles --region us-east-1\` |
| Test model access | \`aws bedrock-runtime invoke-model --model-id us.anthropic.claude-*\` |
| Verify credentials | \`aws configure list\` |

---

## Conclusion

Setting up Anthropic models on AWS Bedrock isn't difficult once you know the gotchas:

1. **Use \`www.\` prefix** in the use case form website field
2. **Use inference profile IDs** (\`us.anthropic.*\`) not direct model IDs
3. **Find the form in Model Catalog**, not the retired Model Access page

I hope this guide saves you the hours of debugging I went through. If you found it helpful, share it with someone else who might be struggling with the same issues.

---

## Resources

- [AWS Bedrock Documentation](https://docs.aws.amazon.com/bedrock/)
- [Anthropic Claude on Bedrock](https://docs.aws.amazon.com/bedrock/latest/userguide/model-parameters-anthropic-claude-messages.html)
- [Inference Profiles Reference](https://docs.aws.amazon.com/bedrock/latest/userguide/inference-profiles-support.html)

---

*Have questions or found another gotcha? Connect with me on [LinkedIn](https://linkedin.com/in/mihai-chindris) or [GitHub](https://github.com/chindris-mihai-alexandru).*
    `.trim(),
  },
  {
    slug: 'building-ai-agents-with-opencode',
    title: 'Building AI Agents with OpenCode and Free LLMs',
    description: 'How to set up an autonomous AI coding agent using OpenCode, OpenRouter, and completely free language models.',
    date: '2026-01-09',
    tags: ['ai', 'opencode', 'agents', 'cloud'],
    readingTime: '10 min read',
    draft: true, // Set to false when ready to publish
    content: `
# Building AI Agents with OpenCode and Free LLMs

> How to set up an autonomous AI coding agent for $0/month

---

## TL;DR

You can run a powerful AI coding agent completely free using:
- **OpenCode** - Open-source AI coding CLI
- **OpenRouter** - Free tier with top coding models
- **MiMo v2 Flash** - Best free coding model (SWE-bench #1)

---

## Introduction

*This post is a work in progress. Check back soon for the complete guide!*

---

## What We're Building

An AI agent that can:
- Read and understand your codebase
- Make changes across multiple files
- Run tests and fix failures
- Respond to GitHub issues automatically

---

## The Stack

| Component | Tool | Cost |
|-----------|------|------|
| AI Agent | OpenCode | Free (open source) |
| LLM Provider | OpenRouter | Free tier |
| Model | MiMo v2 Flash | Free |
| Automation | Cyrus + Linear | Free |

---

## Coming Soon

- Step-by-step setup guide
- OpenCode configuration
- Free model comparison
- Linear integration for automated issue handling

---

*Stay tuned! Follow me on [LinkedIn](https://linkedin.com/in/mihai-chindris) for updates.*
    `.trim(),
  },
  {
    slug: 'hello-world',
    title: 'Hello, World!',
    description: 'Welcome to my corner of the internet. Here\'s what I\'m building and why.',
    date: '2026-01-07',
    tags: ['personal', 'meta'],
    readingTime: '3 min read',
    content: `
# Hello, World!

Welcome to **mihai.codes** - my personal corner of the internet.

## Why This Site?

I've always believed that the best way to learn is to build in public. This site is my experiment in:

1. **Qwik** - A resumable framework that ships near-zero JavaScript
2. **Tailwind CSS** - Utility-first styling with dark/light theme support
3. **Cloudflare Pages** - Edge deployment for global performance

## What to Expect

I'll be writing about:

- **Software Engineering** - Deep dives into architecture, patterns, and lessons learned
- **Product Thinking** - My journey from engineer to aspiring PM
- **Building in Public** - Progress updates on this site and other projects

## The Tech Stack

This site is intentionally over-engineered for learning purposes:

\`\`\`
Frontend:  Qwik + Tailwind CSS
Testing:   Vitest + Codecov
Hosting:   Cloudflare Pages
CI/CD:     GitHub Actions
\`\`\`

## Let's Connect

Find me on [GitHub](https://github.com/chindris-mihai-alexandru) or [LinkedIn](https://linkedin.com/in/mihai-chindris).

Thanks for reading!

— Mihai
    `.trim(),
  },
  {
    slug: 'why-qwik',
    title: 'Why I Chose Qwik Over Next.js',
    description: 'A deep dive into resumability, hydration, and why Qwik\'s approach to JavaScript is revolutionary.',
    date: '2026-01-06',
    tags: ['qwik', 'javascript', 'frameworks'],
    readingTime: '5 min read',
    content: `
# Why I Chose Qwik Over Next.js

When I started building this site, the obvious choice was Next.js. It's battle-tested, has great DX, and the ecosystem is huge.

So why did I choose Qwik instead?

## The Problem with Hydration

Traditional frameworks like React, Vue, and even Next.js all share the same fundamental problem: **hydration**.

Here's what happens:

1. Server renders HTML
2. Client downloads JavaScript bundle
3. Client re-executes the same code to "hydrate" the page
4. Page becomes interactive

This means you're essentially running your app **twice**. Once on the server, once on the client.

## Qwik's Resumability

Qwik takes a radically different approach. Instead of hydration, it uses **resumability**:

1. Server renders HTML with embedded serialized state
2. Client downloads only the JavaScript needed for the current interaction
3. No re-execution - it "resumes" where the server left off

\`\`\`typescript
// This component ships ZERO JavaScript until you click
export const Counter = component$(() => {
  const count = useSignal(0);
  
  return (
    <button onClick$={() => count.value++}>
      Count: {count.value}
    </button>
  );
});
\`\`\`

## The Results

On this site, the initial JavaScript payload is **under 1KB**. Compare that to a typical Next.js app which ships 70-100KB+ just for React itself.

## Trade-offs

Qwik isn't perfect:

- Smaller ecosystem than React
- Learning curve for the \`$\` syntax
- Some edge cases with third-party libraries

But for a personal site where performance matters? It's perfect.

## Conclusion

If you're building content-heavy sites, blogs, or marketing pages - give Qwik a try. The performance wins are real.

— Mihai
    `.trim(),
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return posts.find((post) => post.slug === slug);
}

export function getAllPosts(): BlogPost[] {
  return posts
    .filter((post) => !post.draft) // Hide drafts from listing
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// Get all posts including drafts (for sitemap, testing, etc.)
export function getAllPostsIncludingDrafts(): BlogPost[] {
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
