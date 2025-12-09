'use client'

import { useState } from 'react'
import { Search, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { McpServerCard } from '@/components/mcp-server-card'
import { AddMcpSheet } from '@/components/add-mcp-sheet'

export default function McpServersPage() {
  const [isAddMcpOpen, setIsAddMcpOpen] = useState(false)
  const mcpServers = [
    {
      name: 'Alpaca',
      description:
        "Agent for stock trading, portfolio management, and market data through Alpaca's trading API",
      image:
        'https://agents-storage.nyc3.digitaloceanspaces.com/agents/alpaca.png',
      badge: 'Finance',
    },
    {
      name: 'GitHub',
      description:
        'Interact with repositories, issues, pull requests, and workflows in your GitHub projects',
      image:
        'https://agents-storage.nyc3.digitaloceanspaces.com/agents/github.png',
      badge: 'DevTools',
    },
    {
      name: 'Slack',
      description:
        'Send messages, read channels, and automate workflows inside your Slack workspace',
      image:
        'https://agents-storage.nyc3.digitaloceanspaces.com/agents/slack.png',
      badge: 'Messaging',
    },
    {
      name: 'Notion',
      description:
        'Query and update databases, pages, and content inside your Notion workspace',
      image:
        'https://agents-storage.nyc3.digitaloceanspaces.com/agents/notion.png',
      badge: 'Knowledge',
    },
    {
      name: 'PostgreSQL',
      description:
        'Connect to PostgreSQL databases to execute queries, manage schemas, and retrieve data',
      image: 'https://www.postgresql.org/media/img/about/press/elephant.png', // new
      badge: 'Database',
    },
    {
      name: 'Google Drive',
      description:
        'Access, search, and manage files and folders in your Google Drive workspace',
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Google_Drive_icon_%282020%29.svg/1147px-Google_Drive_icon_%282020%29.svg.png', // new
      badge: 'Storage',
    },
    {
      name: 'Stripe',
      description:
        'Process payments, manage subscriptions, and handle billing through Stripe API',
      image:
        'https://agents-storage.nyc3.digitaloceanspaces.com/agents/stripe.png',
      badge: 'Payments',
    },
    {
      name: 'Jira',
      description:
        'Create issues, update tickets, and manage projects in your Jira workspace',
      image:
        'https://agents-storage.nyc3.digitaloceanspaces.com/agents/jira.png',
      badge: 'Project',
    },
    {
      name: 'SendGrid',
      description:
        'Send transactional emails, manage templates, and track email analytics',
      image:
        'https://agents-storage.nyc3.digitaloceanspaces.com/agents/sendgrid.png',
      badge: 'Email',
    },
    {
      name: 'Airtable',
      description:
        'Query and update records in your Airtable bases with flexible database operations',
      image:
        'https://agents-storage.nyc3.digitaloceanspaces.com/agents/airtable.png',
      badge: 'Database',
    },
    {
      name: 'Linear',
      description:
        'Create issues, manage projects, and track development workflows in Linear',
      image:
        'https://agents-storage.nyc3.digitaloceanspaces.com/agents/linear.png',
      badge: 'Project',
    },
    {
      name: 'Shopify',
      description:
        'Manage products, orders, and customers in your Shopify store',
      image:
        'https://agents-storage.nyc3.digitaloceanspaces.com/agents/shopify.png',
      badge: 'E-commerce',
    },
    {
      name: 'Salesforce',
      description:
        'Access CRM data, manage leads, and automate sales processes in Salesforce',
      image:
        'https://agents-storage.nyc3.digitaloceanspaces.com/agents/salesforce.png',
      badge: 'CRM',
    },
  ]
//   const mcpServers = [
//   {
//     name: 'Alpaca',
//     description:
//       "Agent for stock trading, portfolio management, and market data through Alpaca's trading API",
//     image: 'https://static.alpaca.markets/logos/alpaca-icon-512x512.png', // new
//     badge: 'Finance',
//   },
//   {
//     name: 'GitHub',
//     description:
//       'Interact with repositories, issues, pull requests, and workflows in your GitHub projects',
//     image: 'https://github.githubassets.com/favicons/favicon.png', // new
//     badge: 'DevTools',
//   },
//   {
//     name: 'Slack',
//     description:
//       'Send messages, read channels, and automate workflows inside your Slack workspace',
//     image: 'https://a.slack-edge.com/80588/marketing/img/icons/icon_slack_hash_colored.png', // new
//     badge: 'Messaging',
//   },
//   {
//     name: 'Notion',
//     description:
//       'Query and update databases, pages, and content inside your Notion workspace',
//     image: 'https://www.notion.so/front-static/logo-ios.png', // new
//     badge: 'Knowledge',
//   },
//   {
//     name: 'PostgreSQL',
//     description:
//       'Connect to PostgreSQL databases to execute queries, manage schemas, and retrieve data',
//     image: 'https://www.postgresql.org/media/img/about/press/elephant.png', // new
//     badge: 'Database',
//   },
//   {
//     name: 'Google Drive',
//     description:
//       'Access, search, and manage files and folders in your Google Drive workspace',
//     image: 'https://ssl.gstatic.com/docs/doclist/images/drive_2022q3_32dp.png', // new
//     badge: 'Storage',
//   },
//   {
//     name: 'Stripe',
//     description:
//       'Process payments, manage subscriptions, and handle billing through Stripe API',
//     image: 'https://stripe.com/img/v3/newsroom/social.png', // new
//     badge: 'Payments',
//   },
//   {
//     name: 'Jira',
//     description:
//       'Create issues, update tickets, and manage projects in your Jira workspace',
//     image: 'https://wac-cdn.atlassian.com/dam/jcr:69a3e7b4-40c2-4f4f-8f3d-6b8e9e6b5c3d/Jira%20Software@2x-blue.png', // new
//     badge: 'Project',
//   },
//   {
//     name: 'AWS S3',
//     description:
//       'Upload, download, and manage objects in your Amazon S3 buckets',
//     image: 'https://a0.awsstatic.com/libra-css/images/logos/aws_logo_smile_1200x630.png', // new
//     badge: 'Cloud',
//   },
//   {
//     name: 'SendGrid',
//     description:
//       'Send transactional emails, manage templates, and track email analytics',
//     image: 'https://marketing.sendgrid.com/global/assets/sg-logo.png', // new
//     badge: 'Email',
//   },
//   {
//     name: 'Airtable',
//     description:
//       'Query and update records in your Airtable bases with flexible database operations',
//     image: 'https://static.airtable.com/images/favicons/favicon-256.png', // new
//     badge: 'Database',
//   },
//   {
//     name: 'Twilio',
//     description:
//       'Send SMS messages, make calls, and manage communications through Twilio API',
//     image: 'https://www.twilio.com/docs/static/img/favicons/favicon-96x96.png', // new
//     badge: 'SMS',
//   },
//   {
//     name: 'Linear',
//     description:
//       'Create issues, manage projects, and track development workflows in Linear',
//     image: 'https://linear.app/static/apple-touch-icon.png', // new
//     badge: 'Project',
//   },
//   {
//     name: 'Shopify',
//     description:
//       'Manage products, orders, and customers in your Shopify store',
//     image: 'https://cdn.shopify.com/static/shopify-favicon.png', // new
//     badge: 'E-commerce',
//   },
//   {
//     name: 'Salesforce',
//     description:
//       'Access CRM data, manage leads, and automate sales processes in Salesforce',
//     image: 'https://a.sfdcstatic.com/shared/images/c360-navigation/2019/salesforce-dots-logo.png', // new
//     badge: 'CRM',
//   },
// ]


  return (
    <div className="w-full px-4 md:px-10 py-10 lg:px-32 lg:py-16">
      <div className="w-full flex flex-col lg:flex-row gap-4 lg:gap-0 lg:justify-between lg:items-center mb-6">
        <h1 className="text-xl md:text-2xl lg:text-3xl font-heading font-semibold text-foreground">
          MCP Servers
        </h1>
        <div className="w-full lg:w-auto flex gap-2 items-center flex-wrap md:flex-nowrap">
          <div className="relative flex-1 min-w-0 md:max-w-[360px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-10 pr-4 w-full h-10 text-xs text-foreground placeholder:text-muted-foreground bg-popover border-border rounded-lg focus:ring-primary/20 transition-all duration-200"
              placeholder="Search"
            />
          </div>
          <Button 
            className="h-10 px-4 rounded-lg shadow-sm flex items-center gap-2 whitespace-nowrap shrink-0"
            onClick={() => setIsAddMcpOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Add MCP
          </Button>
        </div>
      </div>

      <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 auto-rows-fr">
        {mcpServers.map((server) => (
          <McpServerCard
            key={server.name}
            name={server.name}
            description={server.description}
            image={server.image}
            badge={server.badge}
          />
        ))}
      </div>

      <AddMcpSheet open={isAddMcpOpen} onOpenChange={setIsAddMcpOpen} />
    </div>
  )
}
