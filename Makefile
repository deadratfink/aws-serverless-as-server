.PHONY: test test-e2e clean readme build invoke

.DEFAULT_GOAL:=help

###############################################################################
# GLOBALS
###############################################################################

# Version used for Git tagging etc.
VERSION:=$(shell bash -c "cat package.json | jq '.version'")

COMPODOC_PATH=documentation

NODE_EXEC_PATH=node_modules/.bin/

DISTRIBUTION_PATH=dist/

# The package name
PACKAGE:=$(shell bash -c "node -pe \"require('./package.json').name\"")
# The package description
# DESCRIPTION:=$(shell bash -c "cat package.json | jq '.description'")
DESCRIPTION:=$(shell bash -c "node -pe \"require('./package.json').description\"")

###############################################################################
# DEPENDENCIES
###############################################################################

install: ## Installs all modules.
	@printf "*******************************************************************************\n"
	@printf "* Installing all modules...\n"
	@printf "*******************************************************************************\n"
	npm install

clean-install: clean install ## Removes files in folders ./node_modules, ./coverage and others and afterwards it makes a fresh install.

# npm outdated returns with error 1 on outdated libs, so we need to suppress the error make will pick up with "|| exit 0"!
# See also discussion at: https://github.com/npm/cli/pull/258
outdated: ## Checks outdated dependencies.
	@printf "*******************************************************************************\n"
	@printf "* Checking outdated dependencies...\n"
	@printf "*******************************************************************************\n"
	npm outdated || exit 0

outdated-fix: ## Updates outdated dependencies.
	@printf "*******************************************************************************\n"
	@printf "* Checking outdated dependencies with fixing...\n"
	@printf "*******************************************************************************\n"
	$(NODE_EXEC_PATH)ncu -u

depcheck: ## Checks on unused dependencies.
	@printf "************************************************************************************************\n"
	@printf "* ATTENTION! Before you delete any dependencies please make sure that they are really unused....\n"
	@printf "************************************************************************************************\n"
	@printf "************************************************************************************************\n"
	@printf "* Checking unused dependencies...\n"
	@printf "************************************************************************************************\n"
	npx depcheck

###############################################################################
# TYPESCRIPT
###############################################################################

tsc: ## Runs Typescript compiler.
	@printf "*******************************************************************************\n"
	@printf "* Running Typescript compiler...\n"
	@printf "*******************************************************************************\n"
	rm -rf $(DISTRIBUTION_PATH)*
	sh -c "$(NODE_EXEC_PATH)tsc"

tsc-no-emit: ## Runs Typescript compiler without emit.
	@printf "*******************************************************************************\n"
	@printf "* Running Typescript compiler without emit...\n"
	@printf "*******************************************************************************\n"
	sh -c "$(NODE_EXEC_PATH)tsc --noEmit"

tsc-watch: ## Runs Typescript compiler in _watch_ mode.
	@printf "*******************************************************************************\n"
	@printf "* Running Typescript compiler in watch mode...\n"
	@printf "*******************************************************************************\n"
	sh -c "$(NODE_EXEC_PATH)tsc -w"

###############################################################################
# DOCUMENTATION
###############################################################################



###############################################################################
# MAKE
###############################################################################

help: ## Prints the help about targets.
	@printf "**********************************************************************\n"
	@printf "* MAKE HELP:\n"
	@printf "**********************************************************************\n"
	@printf "Usage:    make [\033[34mtarget\033[0m]\n"
	@printf "Default:  \033[34m%s\033[0m\n" $(.DEFAULT_GOAL)
	@printf "Targets:\n"
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf " \033[34m%-35s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST) | sort

print-make: ## Prints the _MAKE.md_ from the _Makefile_.
	@printf "**************************************************************************************************\n";
	@printf "* Printing MAKE.md...\n"
	@printf "**************************************************************************************************\n";
	@printf "Target Call | Description | Dependencies\n---|---|---\n" > MAKE.tmp;

	@printf " - Find out what is the default goal (if set)";
	@if [ ! -z "$(.DEFAULT_GOAL)" ]; then \
		printf " - Default target: $(.DEFAULT_GOAL)\n"; \
		printf "\`$ make\` | This calls the default target \`$(.DEFAULT_GOAL)\`. |\n" >> MAKE.tmp; \
	else \
		printf " - No default target found.\n"; \
	fi

	@printf " - Printing all targets\n";
	@awk 'BEGIN {FS = ": |## "} /^[a-zA-Z_-]+:.*?## / {printf "\`make %s\` | %s | `%s`\n", $$1, $$3, $$2}' $(MAKEFILE_LIST) | sort >> MAKE.tmp;
	@cat MAKE.tmp | sed "s/| \`\`$$/|/g" > MAKE.md;
	@rm -f MAKE.tmp;

###############################################################################
# GIT
###############################################################################

git-tag: ## Tags the branch with current version an push it to git.
	@printf "**********************************************************************\n"
	@printf "* Tagging current Git branch with version: v${VERSION}...\n"
	@printf "**********************************************************************\n"
	git tag v${VERSION}
	git push origin v${VERSION}

git-delete-tag: ## Deletes the current tag version.
	@printf "**********************************************************************\n"
	@printf "* Deleting Git tag with version: v${VERSION}...\n"
	@printf "**********************************************************************\n"
	git push --delete origin v${VERSION}

###############################################################################
# LINT
###############################################################################

lint: ## Runs linter.
	@printf "*******************************************************************************\n"
	@printf "* Running linter...\n"
	@printf "*******************************************************************************\n"
	sh -c "$(NODE_EXEC_PATH)eslint -c ./.eslintrc.js './**/*.ts'"

lint-fix: ## Runs linter with fixing.
	@printf "*******************************************************************************\n"
	@printf "* Running linter with fixing...\n"
	@printf "*******************************************************************************\n"
	sh -c "$(NODE_EXEC_PATH)eslint -c ./.eslintrc.js './**/*.ts' --fix"

lint-staged: ## Runs lint-staged.
	@printf "*******************************************************************************\n"
	@printf "* Running lint-staged...\n"
	@printf "*******************************************************************************\n"
	sh -c "$(NODE_EXEC_PATH)lint-staged"

###############################################################################
# TEST
###############################################################################

test: lint ## Lints and runs the test suite.
	@printf "*******************************************************************************\n"
	@printf "* Running test suite...\n"
	@printf "*******************************************************************************\n"
	npm test

test-watch: ## Runs the test suite  in _watch_ mode.
	@printf "*******************************************************************************\n"
	@printf "* Running test suite in watch mode...\n"
	@printf "*******************************************************************************\n"
	npm run test:watch

test-clear-jest-cache: ## Clears Jest cache.
	@printf "*******************************************************************************\n"
	@printf "* Clearing Jest cache...\n"
	@printf "*******************************************************************************\n"
	rm -rf $(jest --showConfig | jq '.config[0].cacheDirectory')

###############################################################################
# TS-PRUNE
###############################################################################

ts-prune: ## Runs ts-prune (which are not used in module).
	@printf "*******************************************************************************\n"
	@printf "* Running ts-prune...\n"
	@printf "*******************************************************************************\n"
	npx ts-prune | grep -v '(used in module)'

ts-prune-interfaces: ## Runs ts-prune only for interfaces (which are not used in module).
	@printf "*******************************************************************************\n"
	@printf "* Running ts-prune only for interfaces...\n"
	@printf "*******************************************************************************\n"
	npx ts-prune | grep ' - I.*' | grep -v '(used in module)'

print-open-api-schema:
	$(NODE_EXEC_PATH)ts-node ./src/print-open-api

start:
	npm start
