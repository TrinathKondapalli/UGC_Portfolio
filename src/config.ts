export const config = {
  whatsapp: '91XXXXXXXXXX',
  whatsappText: "Hi Tzinr, I'd like a free sample ad",
  email: 'hello@yourdomain.com',
  instagram: 'tzinr.ugc',
};

export const whatsappUrl = (text: string = config.whatsappText) =>
  `https://wa.me/${config.whatsapp}?text=${encodeURIComponent(text)}`;

export const instagramUrl = `https://www.instagram.com/${config.instagram}/`;

export const emailUrl = `mailto:${config.email}`;
