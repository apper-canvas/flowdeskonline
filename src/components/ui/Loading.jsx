import ApperIcon from "@/components/ApperIcon"

const Loading = ({ text = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-gray-200 rounded-full animate-spin">
          <div className="absolute inset-0 border-4 border-transparent border-t-primary rounded-full animate-spin"></div>
        </div>
      </div>
      <p className="mt-4 text-sm text-gray-600 font-medium">{text}</p>
    </div>
  )
}

export default Loading