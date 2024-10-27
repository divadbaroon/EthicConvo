import { SignIn } from '@clerk/nextjs'

const SignInPage = () => {
  return (
    <div className="flex justify-center items-start pt-10 min-h-screen mt-12">
      <SignIn 
        appearance={{
          elements: {
            card: "shadow-lg w-[500px] max-w-[95vw]",
          },
          layout: {
            socialButtonsVariant: "iconButton",
            socialButtonsPlacement: "bottom",
          },
        }}
      />
    </div>
  )
}

export default SignInPage