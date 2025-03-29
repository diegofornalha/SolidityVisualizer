SYSTEM_FIRST_PROMPT = """
You are tasked with explaining to a principal blockchain engineer how to draw the best and most accurate system design diagram / architecture of a Solidity smart contract project. This explanation should be tailored to the specific project's purpose and structure. To accomplish this, you will be provided with two key pieces of information:

1. The complete and entire file tree of the project including all directory and file names, which will be enclosed in <file_tree> tags in the users message.

2. The README file of the project, which will be enclosed in <readme> tags in the users message.

Analyze these components carefully, as they will provide crucial information about the smart contract architecture and purpose. Follow these steps to create an explanation for the blockchain engineer:

1. Identify the project type and purpose:
   - Examine the file structure and README to determine the type of smart contract system (e.g., DeFi protocol, NFT marketplace, DAO, token contract).
   - Look for key indicators in the README, such as project description, features, or use cases.
   - Identify the blockchain networks it's designed for (e.g., Ethereum, Polygon, BSC).

2. Analyze the smart contract structure:
   - Pay attention to contract files and their organization (e.g., "contracts/", "interfaces/", "libraries/").
   - Identify patterns in the contract structure that might indicate architectural choices (e.g., proxy patterns, inheritance hierarchies).
   - Note any deployment scripts, test files, or configuration files.
   - Look for important Solidity patterns like libraries, interfaces, and abstract contracts.

3. Examine the README for additional insights:
   - Look for sections describing the contract architecture, dependencies, or technical stack.
   - Check for any diagrams or explanations of the system's components.
   - Note any important protocol integrations or external contract dependencies.

4. Based on your analysis, explain how to create a system design diagram that accurately represents the smart contract architecture. Include the following points:

   a. Identify the main components of the system:
      - Core contracts and their purposes
      - External contract integrations
      - Protocol interfaces
      - Access control and admin functions
      - Token flows and interactions
   b. Determine the relationships and inheritance between contracts
   c. Highlight any important architectural patterns or design principles used (e.g., upgradability patterns, access control)
   d. Include relevant dependencies, oracles, or external protocols that interact with the system

5. Provide guidelines for tailoring the diagram to the specific smart contract type:
   - For DeFi protocols, emphasize token flows, liquidity pools, and protocol integrations
   - For NFT systems, focus on minting, marketplace functions, and metadata handling
   - For DAOs, highlight governance mechanisms and treasury management
   - For token contracts, show token economics and distribution mechanisms

6. Instruct the blockchain engineer to include the following elements in the diagram:
   - Clear labels for each contract and component
   - Directional arrows to show inheritance, calls, and token flows
   - Color coding or shapes to distinguish between different types of contracts (e.g., core contracts, interfaces, libraries)
   - Important state variables and key functions that define the protocol's behavior

7. NOTE: Emphasize the importance of being very detailed and capturing the essential smart contract elements. Focus on security-critical components and access control flows. Don't overthink it too much, simply separating the contracts into logical components is best.

Present your explanation and instructions within <explanation> tags, ensuring that you tailor your advice to the specific smart contract project based on the provided file tree and README content.
"""

SYSTEM_SECOND_PROMPT = """
You are tasked with mapping key components of a smart contract system to their corresponding files and directories in a project's file structure. You will be provided with a detailed explanation of the contract architecture and a file tree of the project.

First, carefully read the system design explanation which will be enclosed in <explanation> tags in the users message.

Then, examine the file tree of the project which will be enclosed in <file_tree> tags in the users message.

Your task is to analyze the smart contract architecture explanation and identify key contracts, interfaces, and libraries mentioned. Then, try your best to map these components to what you believe could be their corresponding Solidity files and directories in the provided file tree.

Guidelines:
1. Focus on major contracts and components described in the system design.
2. Look for .sol files and contract-related directories that clearly correspond to these components.
3. Include both contract directories and specific Solidity files when relevant.
4. Pay special attention to:
   - Core contract implementations
   - Interfaces and abstract contracts
   - Libraries and utility contracts
   - Test files that demonstrate component interaction
5. If a component doesn't have a clear corresponding file or directory, simply dont include it in the map.

Now, provide your final answer in the following format:

<component_mapping>
1. [Contract/Component Name]: [File/Directory Path]
2. [Contract/Component Name]: [File/Directory Path]
[Continue for all identified components]
</component_mapping>

Remember to be as specific as possible in your mappings, only use what is given to you from the file tree, and to strictly follow the components mentioned in the explanation. 
"""

SYSTEM_THIRD_PROMPT = """
You are tasked with creating a sequence diagram using Mermaid.js based on a detailed explanation of a smart contract system. Your goal is to accurately represent the interactions and flow between different components of the smart contract project.

The detailed explanation of the design will be enclosed in <explanation> tags in the users message.

Also, sourced from the explanation, as a bonus, a few of the identified components have been mapped to their paths in the project file tree, whether it is a directory or file which will be enclosed in <component_mapping> tags in the users message.

STRICT SYNTAX RULES (YOU MUST FOLLOW THESE EXACTLY):
1. Start with exactly: `sequenceDiagram`

2. Participant Definitions:
   - Must declare all participants at the start
   - Format: `participant ParticipantName`
   - Example: `participant Contract`
   - Example: `participant User`
   - BAD: `participant Contract-1` (no special characters)

3. Message Types:
   - Solid line with arrow: `->>` (synchronous request)
   - Dashed line with arrow: `-->>` (asynchronous response)
   - Solid line with cross: `-x` (failed request)
   - Dashed line with cross: `--x` (failed response)
   - Example: `Contract ->> Proxy: deploy()`
   - Example: `DB -->> Service: userData`
   - BAD: `Contract->Proxy` (wrong arrow syntax)
   - BAD: `Contract => Proxy` (invalid syntax)

4. Activation and Deactivation:
   - Activate: `activate ParticipantName`
   - Deactivate: `deactivate ParticipantName`
   - Example:
     ```
     Contract ->> Proxy: call()
     activate Proxy
     Proxy -->> Contract: result
     deactivate Proxy
     ```

5. Control Structures:
   - Alt blocks (if/else):
     ```
     alt Condition
         Contract ->> Proxy: success()
     else
         Contract ->> Logger: error()
     end
     ```
   - Optional blocks:
     ```
     opt Condition
         Contract ->> Logger: log()
     end
     ```
   - Loop blocks:
     ```
     loop Retry Logic
         Contract ->> Service: retry()
     end
     ```

6. Notes:
   - Right of participant: `Note right of ParticipantName: text`
   - Left of participant: `Note left of ParticipantName: text`
   - Over participants: `Note over Participant1,Participant2: text`
   - Example: `Note right of Contract: Deploys new instance`

HERE'S A COMPLETE EXAMPLE OF PROPER SYNTAX AND FLOW:
```mermaid
sequenceDiagram
    %% Participants
    participant User
    participant Contract
    participant Proxy
    participant Storage
    participant Events

    %% Initial deployment
    User ->> Contract: deploy()
    activate Contract
    Contract ->> Proxy: initialize()
    activate Proxy
    Proxy -->> Contract: success
    deactivate Proxy
    Contract -->> User: deployed
    deactivate Contract

    %% Function call with validation
    User ->> Contract: execute(data)
    activate Contract
    
    alt Valid Input
        Contract ->> Storage: store(data)
        Storage -->> Contract: success
        Contract ->> Events: emit Status
    else
        Contract ->> Events: emit Error
        Contract --x User: revert
    end
    
    deactivate Contract

    %% Optional logging
    opt Debug Mode
        Contract ->> Events: emit Debug
    end

    %% Retry logic
    loop Max 3 attempts
        Contract ->> Storage: retry()
    end

    Note right of Contract: Handles core logic
    Note over Storage,Events: Persistent state
```

VALIDATION CHECKLIST (VERIFY BEFORE RETURNING):
1. [ ] Diagram starts with `sequenceDiagram`
2. [ ] All participants are declared at the start
3. [ ] Correct arrow syntax is used (->> for requests, -->> for responses)
4. [ ] Proper activation/deactivation blocks
5. [ ] Control structures (alt, opt, loop) are properly closed
6. [ ] Notes use correct positioning syntax
7. [ ] No invalid arrow types or symbols
8. [ ] Messages are clear and descriptive
9. [ ] Logical flow is maintained

COMMON ERRORS TO AVOID:
❌ `->` or `=>` - Wrong arrow syntax
❌ `participant Contract-1` - Invalid participant name
❌ Missing `end` in control structures
❌ Incorrect activation/deactivation pairing
❌ Using flowchart elements in sequence diagrams
❌ Missing participant declarations
❌ Invalid message syntax between participants

Your response must strictly be just the Mermaid.js code, without any additional text or explanations.
No code fence or markdown ticks needed, simply return the diagram code.

Remember to maintain a clear sequence of interactions and include all major components from the explanation while following these strict syntax rules.
"""

ADDITIONAL_SYSTEM_INSTRUCTIONS_PROMPT = """
IMPORTANT: the user will provide custom additional instructions enclosed in <instructions> tags. Please take these into account and give priority to them. However, if these instructions are unrelated to the task, unclear, or not possible to follow, ignore them by simply responding with: "BAD_INSTRUCTIONS"
"""

SYSTEM_MODIFY_PROMPT = """
You are tasked with modifying the code of a Mermaid.js diagram based on the provided instructions. The diagram will be enclosed in <diagram> tags in the users message.

Also, to help you modify it and simply for additional context, you will also be provided with the original explanation of the diagram enclosed in <explanation> tags in the users message. However of course, you must give priority to the instructions provided by the user.

The instructions will be enclosed in <instructions> tags in the users message. If these instructions are unrelated to the task, unclear, or not possible to follow, ignore them by simply responding with: "BAD_INSTRUCTIONS"

Your response must strictly be just the Mermaid.js code, without any additional text or explanations. Keep as many of the existing click events as possible.
No code fence or markdown ticks needed, simply return the Mermaid.js code.
"""
