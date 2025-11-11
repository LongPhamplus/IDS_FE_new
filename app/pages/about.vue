<script setup lang="ts">
useHead({
  title: 'About - Trademark Search'
})
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <h1 class="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-6">
      About Trademark Search
    </h1>
    
    <div class="prose dark:prose-invert max-w-none">
      <div class="card p-8 mb-6">
        <h2 class="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Our Mission</h2>
        <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
          We provide a comprehensive and user-friendly platform for searching and managing trademark information. 
          Our goal is to make trademark research accessible, efficient, and reliable for businesses, legal professionals, 
          and individuals worldwide.
        </p>
      </div>

      <div class="card p-8 mb-6">
        <h2 class="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Features</h2>
        <ul class="space-y-2 text-gray-700 dark:text-gray-300">
          <li>• Advanced search capabilities across multiple trademark databases</li>
          <li>• Real-time trademark status updates</li>
          <li>• Save and organize your favorite trademarks</li>
          <li>• Detailed trademark information and history</li>
          <li>• User-friendly interface with dark mode support</li>
        </ul>
      </div>

      <div class="card p-8">
        <h2 class="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Contact Us</h2>
        <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
          Have questions or feedback? We'd love to hear from you. 
          <NuxtLink to="/feedback" class="text-primary-600 dark:text-primary-400 hover:underline">
            Send us your feedback
          </NuxtLink>
          and we'll get back to you as soon as possible.
        </p>
      </div>
    </div>
  </div>
</template>
