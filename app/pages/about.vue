<script setup lang="ts">
useHead({
  title: 'Về chúng tôi - Tra cứu nhãn hiệu'
})
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <h1 class="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-6">
      Về hệ thống Tra cứu nhãn hiệu
    </h1>
    
    <div class="prose dark:prose-invert max-w-none">
      <div class="card p-8 mb-6">
        <h2 class="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Sứ mệnh của chúng tôi</h2>
        <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
          Chúng tôi cung cấp một nền tảng toàn diện và thân thiện để tìm kiếm và quản lý thông tin nhãn hiệu.
          Mục tiêu của chúng tôi là làm cho việc nghiên cứu nhãn hiệu trở nên dễ tiếp cận, hiệu quả và đáng tin cậy cho các doanh nghiệp, chuyên gia pháp lý
          và cá nhân trên toàn thế giới.
        </p>
      </div>

      <div class="card p-8 mb-6">
        <h2 class="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Tính năng nổi bật</h2>
        <ul class="space-y-2 text-gray-700 dark:text-gray-300">
          <li>• Khả năng tìm kiếm nâng cao trên nhiều cơ sở dữ liệu nhãn hiệu</li>
          <li>• Cập nhật trạng thái nhãn hiệu theo thời gian thực</li>
          <li>• Lưu và sắp xếp các nhãn hiệu yêu thích của bạn</li>
          <li>• Thông tin nhãn hiệu chi tiết và lịch sử</li>
          <li>• Giao diện thân thiện với hỗ trợ chế độ tối (dark mode)</li>
        </ul>
      </div>

      <div class="card p-8">
        <h2 class="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Liên hệ</h2>
        <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
          Bạn có câu hỏi hoặc ý kiến đóng góp? Chúng tôi rất mong nhận được phản hồi từ bạn.
          <NuxtLink to="/feedback" class="text-primary-600 dark:text-primary-400 hover:underline">
            Gửi phản hồi cho chúng tôi
          </NuxtLink>
          và chúng tôi sẽ liên hệ lại với bạn sớm nhất có thể.
        </p>
      </div>
    </div>
  </div>
</template>
