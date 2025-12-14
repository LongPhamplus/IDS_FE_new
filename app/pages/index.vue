<script setup lang="ts">
import { MagnifyingGlassIcon, BookmarkIcon, BellAlertIcon } from '@heroicons/vue/24/outline'

const searchQuery = ref('')

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    navigateTo(`/search?q=${encodeURIComponent(searchQuery.value)}`)
  }
}

const features = [
  {
    icon: MagnifyingGlassIcon,
    title: 'Tìm kiếm nâng cao',
    description: 'Tìm kiếm nhãn hiệu theo tên, nhóm, chủ sở hữu hoặc số đơn với các bộ lọc mạnh mẽ.'
  },
  {
    icon: BookmarkIcon,
    title: 'Lưu yêu thích',
    description: 'Theo dõi các nhãn hiệu quan trọng bằng cách lưu chúng vào bộ sưu tập cá nhân của bạn.'
  },
  {
    icon: BellAlertIcon,
    title: 'Gửi phản hồi',
    description: 'Báo cáo sự cố hoặc đề xuất cải tiến để giúp chúng tôi phục vụ bạn tốt hơn.'
  }
]
</script>

<template>
  <div class="min-h-[calc(100vh-8rem)] animate-fade-in">
    <!-- Hero Section -->
    <div class="relative overflow-hidden bg-gradient-to-br from-primary-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 py-24">
      <!-- Decorative elements -->
      <div class="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div class="absolute top-20 left-10 w-72 h-72 bg-primary-200/30 dark:bg-primary-900/20 rounded-full blur-3xl"></div>
        <div class="absolute bottom-20 right-10 w-96 h-96 bg-purple-200/30 dark:bg-purple-900/20 rounded-full blur-3xl"></div>
      </div>
      
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="text-center animate-slide-up">
          
          <h1 class="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight">
            <span class="text-gray-900 dark:text-white">Tìm kiếm nhãn hiệu</span>
            <br />
            <span class="gradient-text">Nhanh chóng & Dễ dàng</span>
          </h1>
          
          <p class="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Truy cập thông tin nhãn hiệu toàn diện với công cụ tìm kiếm mạnh mẽ của chúng tôi.
            Tìm, lưu và quản lý nhãn hiệu một cách dễ dàng.
          </p>

          <!-- Search Bar -->
          <div class="max-w-3xl mx-auto">
            <div class="relative glass-effect rounded-2xl shadow-2xl p-2">
              <div class="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                <MagnifyingGlassIcon class="h-7 w-7 text-primary-500" />
              </div>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Tìm kiếm nhãn hiệu, thương hiệu hoặc công ty..."
                @keyup.enter="handleSearch"
                class="w-full pl-16 pr-36 py-5 text-lg bg-transparent border-none text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none"
              />
              <button
                @click="handleSearch"
                class="absolute right-3 top-1/2 -translate-y-1/2 btn-primary px-8 py-3 text-base"
              >
                Tìm kiếm
              </button>
            </div>
            
            <!-- Quick stats -->
            <div class="mt-8 flex items-center justify-center gap-8 text-sm text-gray-600 dark:text-gray-400">
              <div class="flex items-center gap-2">
                <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>1M+ Nhãn hiệu</span>
              </div>
              <div class="flex items-center gap-2">
                <div class="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span>Cập nhật thời gian thực</span>
              </div>
              <div class="flex items-center gap-2">
                <div class="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                <span>Hỗ trợ bởi AI</span>
              </div>
            </div>
          </div>

          <!-- IP Commercialization Banner -->
          <div class="max-w-5xl mx-auto mt-16 animate-slide-up" style="animation-delay: 200ms">
            <div class="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 dark:from-amber-600 dark:via-orange-600 dark:to-red-600 p-1 shadow-2xl">
              <div class="bg-white dark:bg-gray-800 rounded-[22px] p-8 md:p-10">
                <div class="flex flex-col md:flex-row items-center gap-6">
                  <!-- Icon -->
                  <div class="flex-shrink-0">
                    <div class="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/50 dark:to-orange-900/50 flex items-center justify-center shadow-lg">
                      <svg class="w-10 h-10 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>

                  <!-- Content -->
                  <div class="flex-1 text-center md:text-left">
                    <h3 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                      Thương mại hóa quyền sở hữu trí tuệ
                    </h3>
                    <p class="text-gray-600 dark:text-gray-300 text-base md:text-lg leading-relaxed">
                      Khám phá cơ hội kinh doanh từ nhãn hiệu của bạn. Chúng tôi hỗ trợ định giá, chuyển nhượng và khai thác thương mại quyền sở hữu trí tuệ một cách hiệu quả.
                    </p>
                  </div>

                  <!-- CTA Button -->
                  <div class="flex-shrink-0">
                    <button class="group px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-2 whitespace-nowrap">
                      <span>Tìm hiểu thêm</span>
                      <svg class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </button>
                  </div>
                </div>

                <!-- Additional Info -->
                <div class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div class="flex flex-wrap items-center justify-center md:justify-start gap-6 text-sm text-gray-600 dark:text-gray-400">
                    <div class="flex items-center gap-2">
                      <svg class="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                      </svg>
                      <span>Định giá chuyên nghiệp</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <svg class="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                      </svg>
                      <span>Tư vấn pháp lý</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <svg class="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                      </svg>
                      <span>Hỗ trợ chuyển nhượng</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Features Section -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div class="text-center mb-16 animate-slide-up">
        <h2 class="text-4xl md:text-5xl font-bold mb-4">
          <span class="text-gray-900 dark:text-white">Tại sao chọn</span>
          <span class="gradient-text"> Nền tảng của chúng tôi?</span>
        </h2>
        <p class="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Mọi thứ bạn cần để tìm kiếm, quản lý và theo dõi nhãn hiệu trong một nền tảng mạnh mẽ.
        </p>
      </div>

      <div class="grid md:grid-cols-3 gap-8">
        <div
          v-for="(feature, index) in features"
          :key="feature.title"
          class="group card p-8 text-center hover:scale-105 transition-all duration-300 animate-scale-in"
          :style="{ animationDelay: `${index * 100}ms` }"
        >
          <div class="inline-flex items-center justify-center h-20 w-20 rounded-2xl bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/50 dark:to-primary-800/50 text-primary-600 dark:text-primary-400 mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
            <component :is="feature.icon" class="h-8 w-8" />
          </div>
          <h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            {{ feature.title }}
          </h3>
          <p class="text-gray-600 dark:text-gray-400">
            {{ feature.description }}
          </p>
        </div>
      </div>
    </div>

    <!-- CTA Section -->
    <div class="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-purple-700 dark:from-primary-800 dark:via-primary-900 dark:to-purple-900 py-24">
      <!-- Decorative elements -->
      <div class="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
        <div class="absolute -top-10 -left-10 w-80 h-80 bg-white rounded-full blur-3xl"></div>
        <div class="absolute -bottom-10 -right-10 w-96 h-96 bg-purple-300 rounded-full blur-3xl"></div>
      </div>
      
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div class="animate-slide-up">
          <h2 class="text-4xl md:text-5xl font-bold text-white mb-6">
            Sẵn sàng để bắt đầu?
          </h2>
          <p class="text-xl text-primary-50 mb-10 max-w-2xl mx-auto leading-relaxed">
            Tham gia cùng hàng ngàn người dùng tin tưởng nền tảng của chúng tôi để tìm kiếm và quản lý nhãn hiệu hiệu quả.
          </p>
          <div class="flex flex-col sm:flex-row justify-center gap-4">
            <NuxtLink 
              to="/search" 
              class="group px-10 py-4 bg-white text-primary-600 rounded-xl font-semibold shadow-2xl hover:shadow-white/20 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <MagnifyingGlassIcon class="h-5 w-5 group-hover:rotate-12 transition-transform" />
              Bắt đầu tìm kiếm
            </NuxtLink>
            <NuxtLink 
              to="/login" 
              class="px-10 py-4 bg-transparent text-white border-2 border-white rounded-xl font-semibold hover:bg-white hover:text-primary-600 transition-all duration-300 hover:scale-105"
            >
              Đăng nhập
            </NuxtLink>
          </div>
          
          <!-- Trust indicators -->
          <div class="mt-12 flex items-center justify-center gap-8 text-sm text-primary-100">
            <div class="flex items-center gap-2">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span>4.9/5 Đánh giá</span>
            </div>
            <div class="flex items-center gap-2">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              <span>Tin cậy bởi 10K+ Người dùng</span>
            </div>
            <div class="flex items-center gap-2">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
              </svg>
              <span>An toàn 100%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
