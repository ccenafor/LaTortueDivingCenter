# Netlify Deployment Guide

## Contact Form Setup

The contact form on this site uses **Netlify Forms**, which is a built-in feature that requires no backend coding.

### How It Works

1. **Netlify automatically detects forms** with the `data-netlify="true"` attribute
2. **Form submissions are stored** in your Netlify dashboard under Forms
3. **Email notifications** can be configured in Netlify settings
4. **Spam protection** is included via honeypot field

### Form Configuration in Netlify Dashboard

After deploying to Netlify, configure the form notifications:

1. Go to your Netlify site dashboard
2. Navigate to **Forms** in the left sidebar
3. Click on **Form notifications**
4. Add an **Email notification** with these settings:
   - Email to notify: `latortue.info@gmail.com`
   - You can also add: `bernard.mika@gmail.com`

### Form Features

✅ **Spam Protection**: Built-in honeypot field (`bot-field`)  
✅ **Required Fields**: Name, Email, Phone, Interest  
✅ **Date Pickers**: Conditional date fields based on booking type  
✅ **Success Page**: Users are redirected to `/contact-success.html` after submission  
✅ **WhatsApp Integration**: Direct WhatsApp button as alternative contact method

### Testing the Form

**On Netlify (Production):**
- Forms work automatically once deployed
- Submissions appear in Netlify dashboard under Forms
- Email notifications are sent based on your configuration

**Local Development:**
- Forms will NOT work locally (Netlify Forms only work on deployed sites)
- To test locally, you can temporarily change the form action to a test endpoint
- Or deploy to a Netlify branch preview for testing

### Viewing Form Submissions

1. Log into your Netlify account
2. Select your site
3. Click **Forms** in the sidebar
4. View all submissions with full details
5. Export submissions as CSV if needed
6. Set up email notifications or webhook integrations

### Email Notification Settings

Recommended notification setup:

**Subject Line:**  
`New Contact Form: {{interest}} - {{name}}`

**Email Body:**
```
New contact form submission from La Tortue website:

Name: {{name}}
Email: {{email}}
Phone: {{phone}}
Interest: {{interest}}
Start Date: {{start_date}}
End Date: {{end_date}}
Table Date: {{table_date}}

Message:
{{message}}

---
Submitted at: {{created_at}}
Form: {{form_name}}
```

### Troubleshooting

**Form not appearing in Netlify:**
- Make sure `data-netlify="true"` attribute is present in the form tag
- Ensure the hidden `form-name` input field exists
- Redeploy the site (Netlify scans forms during build)

**Not receiving email notifications:**
- Check spam/junk folder
- Verify email notification is properly configured in Netlify dashboard
- Check notification settings under Site settings > Forms > Form notifications

**Form submissions are spam:**
- Netlify provides built-in spam filtering
- Our form includes honeypot protection
- You can enable reCAPTCHA in Netlify settings if needed

### Additional Security

To add reCAPTCHA protection (optional):

1. Go to Site settings > Forms
2. Enable **reCAPTCHA 2** or **Invisible reCAPTCHA**
3. Add your reCAPTCHA site key
4. Netlify will automatically add the reCAPTCHA widget to forms

## Deployment Steps

1. Push code to GitHub repository
2. Connect repository to Netlify
3. Set build settings:
   - Build command: (leave empty - static site)
   - Publish directory: `/` (root directory)
4. Deploy site
5. Configure form notifications in Netlify dashboard
6. Test the contact form on the live site

## Custom Domain Setup

If using a custom domain:

1. Add domain in Netlify: Site settings > Domain management
2. Configure DNS records as instructed by Netlify
3. Enable HTTPS (automatic via Let's Encrypt)
4. Forms will work automatically on custom domain

## Support

For Netlify Forms documentation:  
https://docs.netlify.com/forms/setup/

For issues with this site's form:  
Contact the development team
