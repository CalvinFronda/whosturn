import { NavLink } from "react-router";

function Hero() {
  return (
    <div>
      {/* Navbar */}

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-24 flex-1">
        <h2 className="text-4xl font-semibold tracking-tight mb-4">
          Stop arguing.
          <br />
          Know exactly whose turn it is.
        </h2>

        <p className="text-gray-600 max-w-md mb-8">
          A simple app that keeps track of turns for chores, picking food,
          rides, bills, and anything else you rotate with friends or family.
        </p>

        <NavLink
          to="/auth/register"
          className="px-5 py-2 border rounded-md text-sm hover:bg-gray-100 transition"
        >
          Get Started
        </NavLink>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20 border-t">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <h3 className="font-medium mb-2">Invite Your Group</h3>
            <p className="text-gray-600 text-sm">
              Add your friends or family in seconds. Everyone stays in sync.
            </p>
          </div>

          <div>
            <h3 className="font-medium mb-2">Track Any Task</h3>
            <p className="text-gray-600 text-sm">
              Chores, errands, dinner picks—anything that rotates.
            </p>
          </div>

          <div>
            <h3 className="font-medium mb-2">No More Debates</h3>
            <p className="text-gray-600 text-sm">
              The app keeps the history. You get the peace.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-6 text-center text-sm text-gray-500 border-t">
        © {new Date().getFullYear()} WhoseTurn. All rights reserved.
      </footer>
    </div>
  );
}

export default Hero;
