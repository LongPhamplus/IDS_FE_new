export const useTrademarkHelpers = () => {
    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            'cấp bằng': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
            'đang giải quyết': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
            'từ chối': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
            'hủy': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
            'hết hạn': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
            'rút đơn': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
        }
        if (!status) return colors['đang giải quyết']
        return colors[status.toLowerCase()] || colors['đang giải quyết']
    }

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'N/A'
        const date = new Date(dateString)
        const day = date.getDate().toString().padStart(2, '0')
        const month = (date.getMonth() + 1).toString().padStart(2, '0')
        const year = date.getFullYear()
        return `${day}/${month}/${year}`
    }

    return {
        getStatusColor,
        formatDate
    }
}
