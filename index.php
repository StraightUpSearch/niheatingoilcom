<?php
/**
 * NI Heating Oil Theme - Main Template
 *
 * This theme is powered by React/Vite. The React app mounts to #root.
 * All content is rendered client-side by the React application.
 *
 * @package NIHeatingOil
 * @version 1.0.0
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1" />
    <title><?php wp_title('|', true, 'right'); ?><?php bloginfo('name'); ?></title>

    <!-- SEO Meta Tags -->
    <meta name="description" content="Compare heating oil prices from 50+ verified suppliers across Northern Ireland. Get real-time price updates, set price alerts, and find the cheapest heating oil deals in your area. Free to use, updated every 2 hours." />

    <!-- Open Graph tags for social media sharing -->
    <meta property="og:title" content="NI Heating Oil - Compare Heating Oil Prices in Northern Ireland" />
    <meta property="og:description" content="Find the cheapest heating oil prices from verified suppliers across Northern Ireland. Real-time updates, price alerts, and comprehensive supplier directory." />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="NI Heating Oil" />
    <meta property="og:locale" content="en_GB" />
    <meta property="og:url" content="<?php echo esc_url(home_url('/')); ?>" />

    <!-- Twitter Card tags -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="NI Heating Oil - Compare Heating Oil Prices in Northern Ireland" />
    <meta name="twitter:description" content="Find the cheapest heating oil prices from verified suppliers across Northern Ireland. Real-time updates, price alerts, and comprehensive supplier directory." />

    <!-- Additional SEO meta tags -->
    <meta name="keywords" content="heating oil prices Northern Ireland, oil price comparison NI, heating oil suppliers Belfast, cheap heating oil Derry, oil prices Armagh, fuel prices Tyrone, heating oil Down, oil suppliers Fermanagh, Antrim heating oil, BT postcode oil prices" />
    <meta name="author" content="NI Heating Oil" />
    <meta name="robots" content="index, follow, max-image-preview:large" />
    <meta name="googlebot" content="index, follow" />

    <!-- Geo targeting -->
    <meta name="geo.region" content="GB-NIR" />
    <meta name="geo.placename" content="Northern Ireland" />
    <meta name="ICBM" content="54.7877, -6.4923" />

    <!-- Canonical URL -->
    <link rel="canonical" href="<?php echo esc_url(home_url('/')); ?>" />

    <!-- JSON-LD Structured Data -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Organization",
          "@id": "<?php echo esc_url(home_url('/')); ?>#organization",
          "name": "NI Heating Oil",
          "url": "<?php echo esc_url(home_url('/')); ?>",
          "logo": {
            "@type": "ImageObject",
            "url": "<?php echo esc_url(get_template_directory_uri() . '/dist/public/favicon.svg'); ?>"
          },
          "description": "NI Heating Oil provides a free online service to compare heating oil prices from numerous verified suppliers across Northern Ireland.",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "14a Victoria Street",
            "addressLocality": "Ballymoney",
            "addressRegion": "Northern Ireland",
            "postalCode": "BT53 6DW",
            "addressCountry": "GB"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": "55.0717",
            "longitude": "-6.5068"
          }
        },
        {
          "@type": "WebSite",
          "@id": "<?php echo esc_url(home_url('/')); ?>#website",
          "url": "<?php echo esc_url(home_url('/')); ?>",
          "name": "NI Heating Oil",
          "description": "Find the cheapest heating oil prices from 50+ verified suppliers across Northern Ireland.",
          "publisher": {
            "@id": "<?php echo esc_url(home_url('/')); ?>#organization"
          },
          "inLanguage": "en-GB"
        }
      ]
    }
    </script>

    <!-- Google Fonts - Inter -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />

    <!-- WordPress Head -->
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
    <?php wp_body_open(); ?>

    <!-- React App Root -->
    <div id="root"></div>

    <!-- WordPress Footer -->
    <?php wp_footer(); ?>
</body>
</html>
