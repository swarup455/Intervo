import Agent from "@/components/Agent"
import { getCurretUser } from "@/lib/actions/auth.actions"

const page = async () => {
    const user = await getCurretUser();

    return (
        <>
            <h3>Interview Generation</h3>
            <Agent userName={user?.name} userId={user?.id} type="generate" />
        </>
    )
}

export default page