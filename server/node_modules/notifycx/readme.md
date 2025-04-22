# NotifyCX Email Client

A lightweight TypeScript client for sending transactional emails through the NotifyCX Email API.

## Installation

```bash
npm install notifycx
```

## Usage

Initialize the Client

```typescript
import Notify from "notifycx";

const notify = new Notify("your-api-key");
```

You can optionally specify a custom API URL during initialization:

```typescript
const notify = new Notify("your-api-key", "https://api.notify.cx/v1");
```

## Getting Your API Key

Before using the client, you'll need an API key:

1. Create an account on [NotifyCX](https://notify.cx).
2. Navigate to your credentials page
3. Find your API key in a secure, masked input field
4. Click the field to copy your API key to clipboard

Keep your API key secure and never share it publicly or commit it to version control.

## Sending Basic Emails

To send a basic email without a template:

```typescript
notify.sendEmail({
  to: "recipient@example.com",
  subject: "Hello",
  name: "John Doe",
  message: "Your email content here",
});
```

### Sending Template-Based Emails

To send an email using a pre-defined template:

```typescript
notify.sendEmailFromTemplate({
  to: "recipient@example.com",
  from: "noreply@notify.cx",
  templateId: "<your_template_id>",
  variables: {
    name: "John Doe",
    company: "Example Inc.",
  },
});
```

### Method Chaining

You can also use method chaining if preferred:

Sending a basic email:

```typescript
new Notify("<your_api_key>").sendEmail({
  to: "recipient@example.com",
  subject: "Hello",
  name: "John Doe",
  message: "Your email content here",
});
```

Sending a template-based email:

```typescript
new Notify("<your_api_key>").sendEmailFromTemplate({
  to: "recipient@example.com",
  from: "noreply@notify.cx",
  templateId: "<your_template_id>",
  variables: {
    name: "John Doe",
    company: "Example Inc.",
  },
});
```

## API Reference

### SendEmailParams

Parameters for sending a basic email:

- `to` (string): Recipient email address
- `subject` (string): Email subject line
- `name` (string): Recipient name
- `message` (string): Email content

### SendEmailFromTemplateParams

Parameters for sending a template-based email:

- `to` (string): Recipient email address
- `from` (string): Sender email address (optional)
- `templateId` (string): ID of the template to use
- `variables` (object): Variables to use in the template (optional)

### SendTestEmailParams

Parameters for sending a basic test email:

- `to` (string): Recipient email address
- `subject` (string): Email subject line
- `name` (string): Recipient name
- `message` (string): Email content

### SendTestEmailFromTemplateParams

Parameters for sending a template-based testemail:

- `to` (string): Recipient email address
- `from` (string): Sender email address (optional)
- `templateId` (string): ID of the template to use
- `variables` (object): Variables to use in the template (optional)

## Error Handling

The client includes built-in error handling. Both `sendEmail` and `sendEmailFromTemplate` methods will throw an error if the API request fails:

```typescript
try {
  await notify.sendEmail({
    to: "recipient@example.com",
    subject: "Hello",
    name: "John Doe",
    message: "Your email content here",
  });
} catch (error) {
  console.error("Failed to send email:", error);
}
```

## License

MIT

## Author

[Notify](https://notify.cx)

For more information and detailed documentation, visit [notify.cx](https://notify.cx).
