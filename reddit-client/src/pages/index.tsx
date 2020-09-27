import { withUrqlClient } from "next-urql";
import { Navbar } from "../components/Navbar";
import { createUrqlClient } from "../utils/createUrqlClient";

const Index = () => (
  <>
    <Navbar />
  hello nextjs world
  </>
)

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);

